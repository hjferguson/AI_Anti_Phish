import { TRUSTED_DOMAINS } from "./lib.js";
import { checkData } from "./api/analyzer.js";
import { mailFactory } from "./mailProviders/background/mailFactory.js";
import { MarkerState, mailBase } from "./mailProviders/background/mailBase.js";

const MAIL_TYPE_URL_INDEX = 2;

// async function getCurrentTab() {
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }


// chrome.tabs.getSelected(null, function (tab) {
//     chrome.tabs.sendRequest(tab.id, { method: 'ping' }, function (response) {
//         console.log(response.data);
//     });
// });

// console.log(chrome);

// chrome.tabs.getCurrent().then((tab) => {
//     console.log(tab);
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log(sender.tab ?
    //     "from a content script:" + sender.tab.url :
    //     "from the extension");
    // console.log(request);
    // sendResponse({ factory: mailFactory });
    // console.log(request, sender);
    if (!sender.tab) return;
    mainExecution(sender.tab.url, request.document);
    sendResponse({ res: "success" });
});

// console.log(chrome.tab.getCurrent());
// chrome.tabs.getSelected(null, (tab) => {
//     console.log(chrome);
// });

// chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
//     console.log(request, sender, sendResponse);
//     // if (request.method == 'ping')
//     //     sendResponse({ data: 'pong' });
//     // else
//     //     sendResponse({});
// });


/**
 * 
 * @param {Array | string} _current_url The current URL.
 * @param {HTMLElement} _document The DOM element where the email should be.
 */
const mainExecution = (_current_url, _document) => {
    const url = _current_url.split("/");
    // console.log("Mail type: ", url[MAIL_TYPE_URL_INDEX], "\nLast token:", url.slice(-1)[0]);
    const type = url[MAIL_TYPE_URL_INDEX];
    const mail = mailFactory(type, _document, url);
    // console.log(mail, typeof mail);
    if (!mail) console.log("Mail provider not supported");
    else generateMailMarker(mail.emailPayload);
    checkData(mail.emailPayload);
};

/**
 * 
 * @param {HTMLElement} _el DOM element where the marker will be 
 * @param {mailBase} _mail Mail Object
 */
const generateMailMarker = (_mail) => {
    // const marker = _mail.markEmail();
    if (checkWhitelist(_mail)) {
        _mail.markEmail(MarkerState.SafeMail);
        return;
    }

    _mail.markEmail(MarkerState.Loading);
    checkData(_mail.emailPayload).then((data) => {
        console.log(data);
        if (!data) {
            _mail.markEmail(MarkerState.Error);
            return;
        }

        if (data.result.prediction === "Phishing Email") {
            _mail.markEmail(MarkerState.PhishingMail);
            _mail.disableLinks();
        } else {
            _mail.markEmail(MarkerState.SafeMail);
        }
    });
};

/**
 * 
 * @param {mailBase} _mail Mail Object
 */
const checkWhitelist = (_mail) => {
    const sender_domain = _mail.sender.split("@").slice(-1);
    return TRUSTED_DOMAINS.includes(sender_domain);
};