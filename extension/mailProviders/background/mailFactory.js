import { mailBase } from "./mailBase.js";
import { gmail } from "./gmail.js";

const EmailType = {
    Gmail: "mail.google.com",
    Outlook: "outlook",
    Yahoo: "yahoo",
}

/**
 * @param {string} _type The type to build.
 * @returns {mailBase} The report model.
 */
export const mailFactory = (_type, _content, _url) => {
    switch (_type) {
        case EmailType.Gmail:
            return new gmail(_content, _url);
        case EmailType.Outlook:
            return false;
        case EmailType.Yahoo:
            return false;
        default:
            return false;
    }
};