import { mailBase } from "./mailBase.js";

const subjectSelector = () => document.querySelector(".ha h2")?.textContent;
const senderSelector = () => document.querySelector('.go')?.textContent?.replace(/<|>/g, "");
const bodySelector = () => document.querySelector('.gs')?.textContent;

export class gmail extends mailBase {
    /**
     * 
     * @param {HTMLElement} _page The DOM element from where the mail will be getted.
     */
    async initializer(_page) {
        // console.log(_page);
        // const subject = await this.sendMessage(subjectSelector);
        // console.log(subject);
        // this.parentMarker(subjectSelector());
        this.subject = await this.sendMessage(subjectSelector);
        this.sender = await this.sendMessage(senderSelector);
        this.body = await this.sendMessage(bodySelector);
    }

    /**
     * @param {string} _state State of the marker to be displayed
     * @returns {HTMLElement}
     */
    markEmail(_state) {
        super.markEmail(_state);
    }

    async disableLinks() {
        await this.sendMessage(() => {
            if (!document) return;
            document.querySelectorAll("a").forEach((a) => {
                const link = a.href;
                a.innerText += `\n${link}`;
                a.href = null;
                a.style.pointerEvents = "none";
            });
        });
    }

    isMailPage() {
        const url = super.isMailPage();
        if (!url) return false;

        // As for Sep 2023, this is the gmail URL format
        // https://mail.google.com/mail/u/1/#inbox/FMfcgzGtxKXLRxzLPxnNXwZmSmqKDrhN
        // ['https:', '', 'mail.google.com', 'mail', 'u', '1', '#inbox', 'FMfcgzGtxKXLRxzLPxnNXwZmSmqKDrhN']
        const last = url.splice(-1)[0];
        return last !== "#inbox"; // if inbox, then we are not in a mail page.
    }

    /**
     * @param {string} _subject The DOM Element that hold the subject
     */
    set subject(_subject) {
        super.subject(_subject);
    }

    /**
     * @param {string} _sender The DOM Element that hold the sender
     */
    set sender(_sender) {
        super.sender(_sender);
    }

    /**
     * @param {string} _body The DOM Element that hold the body
     */
    set body(_body) {
        super.body(_body);
    }
}