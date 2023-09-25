const MAIL_TYPE_URL_INDEX = 2;

window.addEventListener("DOMContentLoaded", (e) => {
    const url = document.URL;
    // console.log("DOM Loaded: ", url, e);
    // console.log(chrome.extension);
    // mainExecution(url);
    analyzeMail(url, document);
});

window.addEventListener("hashchange", async (e) => {
    const url = document.URL;
    // console.log("URL Changed: ", url, e);
    // const response = await chrome.runtime.sendMessage({ url, document });
    // console.log(chrome);
    // mainExecution(url);
    // shouldTriggerExtension(document.URL);
    analyzeMail(url, document);
});

/**
 * 
 * @param {string} _url The URL of the website
 * @param {HTMLElement} _doc The DOM element to get the email from
 */
const analyzeMail = async (_url, _doc) => {
    _url = _url.split("/");
    // console.log(_doc);
    // _doc = new Proxy(_doc);
    // _doc = _doc.querySelector("body");
    // console.log(_doc);
    const response = await chrome.runtime.sendMessage({ url: _url, document: _doc });
    console.log(response);
};


function shouldTriggerExtension(currentUrl) {
    //console.log("triggered check for individual email")
    //console.log("target slice: ", currentUrl.slice(-5));
    //document.URL
    if (currentUrl.slice(-5) === "inbox") {
        var isInInbox = true
    } else {
        var isInInbox = false
    }
    //console.log("we are in inbox?", isInInbox);

    //const isViewingEmail = isInInbox && !!currentUrl.match(/\/#inbox\/.+/);
    console.log("Inbox? ", isInInbox);
    if (!isInInbox) {
        //console.log("we enter the call to extractEmailInfo...");

        const wholeEmail = extractEmailInfo(); //returns list of strings
        if (!wholeEmail) {
            const subjectDiv = document.querySelector('.ha h2');
            const icon = document.createElement("span");
            if (subjectDiv) subjectDiv.appendChild(icon);
            icon.style = "margin: 0 0.5em;font-size: 0.7em;background: #80ff75; height: 15px; width: 15px; border-radius: 50%; border: 2px solid #43db4d; display: inline-block;";
            // icon.innerHTML = "&nbsp;&nbsp;&nbsp;"; 
            return;
        }

        const jsonwholeEmail = JSON.stringify(wholeEmail);

        // Using Fetch API
        console.log(">>> Creating badge");
        const subjectDiv = document.querySelector('.ha h2');
        const icon = document.createElement("span");
        if (subjectDiv) subjectDiv.appendChild(icon);
        // icon.style = "margin: 0 0.5em;font-size: 0.7em;background: #969696;color: #000000; padding: .1em .4em;border-radius: 100%;font-weight: 600;";
        icon.style = "margin: 0 0.5em;background: #969696; height: 15px; " +
            " width: 15px; border-radius: 50%; border: 2px solid #000; display: inline-block;";
        // icon.innerHTML = "Loading...";
        icon.innerHTML = "&nbsp;";

        console.log(jsonwholeEmail);
        checkData(jsonwholeEmail).then((x) => {
            console.log(x);

            if (!x) {
                icon.innerHTML = "Error";
                icon.style = "margin: 0 0.5em;font-size: 0.7em; padding: .1em .4em; " +
                    "border-radius: 10px;font-weight: 600; background: #F9C7C7;color: #DB4349;";
                return;
            }

            icon.innerHTML = "&nbsp;"; // ` ${x.result.prediction}`;
            // icon.style = "margin: 0 0.5em;font-size: 0.7em; padding: .1em .4em;border-radius: 10px;font-weight: 600;";
            if (x.result.prediction === "Phishing Email") {
                // const score = percentageToLetter(x.result.probabilities.phishing);

                icon.innerHTML = `Phishing Email`;
                icon.style = "margin: 0 0.5em;font-size: 0.7em; padding: .1em .4em;border-radius: 10px;font-weight: 600; background: red; color: white;";
                document.querySelectorAll('.gs').forEach((el) => {
                    el.querySelectorAll("a").forEach((a) => {
                        const link = a.href;
                        a.innerText += `\n${link}`
                        a.href = "";
                        a.style += "; pointer-events: none;";
                    })
                });
            }
            else icon.style = "margin: 0 0.5em;font-size: 0.7em;background: #80ff75; height: 15px; width: 15px; border-radius: 50%; border: 2px solid #43db4d; display: inline-block;";
            icon.id = "badge";
        });


    }

}

function percentageToLetter(_percentage) {
    if (_percentage <= 0.49) return "F";
    if (_percentage >= 0.50 && _percentage <= 0.54) return "D";
    if (_percentage >= 0.55 && _percentage <= 0.64) return "C";
    if (_percentage >= 0.65 && _percentage <= 0.79) return "B";
    return "A";
}


// Function to extract email information and communicate with the background script
function extractEmailInfo() {

    //first important detail is sender. need to grab and compare to whitelist
    const spanElement = document.querySelector('.go');
    const emailSender = spanElement ? spanElement.textContent : null;
    const cleanedEmailSender = emailSender.replace(/<|>/g, ''); //gmail displays sender in <>

    console.log("cleanedEmailSender within extract: ", cleanedEmailSender);
    console.log("bool of cleaned: ", isTrustedEmail(cleanedEmailSender));

    if (isTrustedEmail(cleanedEmailSender)) {
        console.log("This domain is trusted! Powering down scans");
        return false;
    }

    //subject
    const subjectDiv = document.querySelector('.ha h2');
    const subject = subjectDiv ? subjectDiv.textContent : null;
    console.log("Subject :", subject);

    //body
    const emailBodyContainer = document.querySelector('.gs');
    const emailBody = emailBodyContainer ? emailBodyContainer.innerText : null;
    console.log("Email body: ", emailBody)

    //replyto    ----this doesnt work... :/
    // const replySpan = document.querySelector('.ajB.gt .ajC tbody .ajv .gL .gI span');
    // const replyToEmail = replySpan ? replySpan.innerText : null;
    // console.log("replyto: ", replyToEmail);

    return {
        emails: cleanedEmailSender,
        subjects: subject,
        body: emailBody,
    };

}

function isTrustedEmail(emailSender) {
    const domain = emailSender.split('@')[1];
    return TRUSTED_DOMAINS.includes(domain);
}
