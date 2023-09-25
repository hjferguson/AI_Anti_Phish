export const MarkerState = {
    Loading: "loading",
    Error: "error",
    SafeMail: "safe-mail",
    PhishingMail: "phishing-mail",
};

export class mailBase {
    /**
     * @type {HTMLElement}
     */
    page;
    /**
     * @type {HTMLElement | undefined}
     */
    #marker;
    /**
     * @type {HTMLElement}
     */
    #parentMarker;
    #url;

    /**
     * @type {string}
     */
    #sender;
    /**
     * @type {string}
     */
    #replyTo;
    /**
     * @type {string}
     */
    #subject;
    /**
     * @type {string}
     */
    #body;

    /**
     * 
     * @param {HTMLElement} _page The DOM element from where the mail will be getted.
     */
    constructor(_page, _url) {
        this.page = _page;
        this.#url = _url;
        this.initializer(this.page);
    }

    /**
     * @param {HTMLElement} _page The DOM element from where the mail will be getted.
     */
    initializer(_page) { }

    /**
     * @param {string} _state State of the marker to be displayed
     * @returns {HTMLElement}
     */
    markEmail(_state) {
        if (!this.isMailPage()) return;
        if (!this.#marker) this.#marker = this.#createMarker();
        switch (_state) {
            case MarkerState.Error:
                this.#markerErrorState();
                break;
            case MarkerState.Loading:
                this.#markerLoadingState();
                break;
            case MarkerState.PhishingMail:
                this.#markerPhishingMail();
                break;
            case MarkerState.SafeMail:
                this.#markerSafeMail();
                break;
        }
        return this.#marker;
    }

    isMailPage() {
        if (!Array.isArray(this.#url) && typeof this.#url == "string")
            this.#url = this.#url.split("/");
        if (!Array.isArray(this.#url))
            return false;
        return this.#url;
    }

    disableLinks() {

    }

    #createMarker() {
        if (!this.#parentMarker) return false;
        const marker = this.page.createElement("span");
        this.#parentMarker.appendChild(marker);
        return marker;
    }

    async sendMessage(_payload) {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { execute: _payload });
        return response;
    }

    #markerErrorState() {
        const style = new CSSStyleDeclaration();
        style.margin = "0 0.5em";
        style.padding = "0.1em 0.4em";
        style.fontSize = "0.7em";
        style.borderRadius = "10px";
        style.fontWeight = "600";
        style.background = "#F9C7C7";
        style.color = "#DB4349";
        this.#marker.style = style;
        this.#marker.innerText = "Error";
        // chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
        //     chrome.tabs.sendMessage(tab.id, {
        //         style,
        //         innerText: "Error"
        //     });
        // });
    }

    #markerLoadingState() {
        const style = new CSSStyleDeclaration();
        style.margin = "0 0.5em";
        style.fontSize = "0.7em";
        style.height = "15px";
        style.width = "15px";
        style.borderRadius = "50%";
        style.background = "#969696";
        style.border = "2px solid #000";
        style.display = "inline-block";
        this.#marker.style = style;
    }

    #markerPhishingMail() {
        const style = new CSSStyleDeclaration();
        style.margin = "0 0.5em";
        style.padding = "0.1em 0.4em";
        style.fontSize = "0.7em";
        style.borderRadius = "10px";
        style.fontWeight = "600";
        style.background = "#ff0000";
        style.color = "#fff";
        this.#marker.style = style;
        this.#marker.innerText = "Phishing Mail";
    }

    #markerSafeMail() {
        const style = new CSSStyleDeclaration();
        style.margin = "0 0.5em";
        style.fontSize = "0.7em";
        style.height = "15px";
        style.width = "15px";
        style.borderRadius = "50%";
        style.background = "#80ff75";
        style.border = "2px solid #43db4d";
        style.display = "inline-block";
        this.#marker.style = style;
    }

    /**
     * @param {HTMLElement} _sender The HTMLElement where the sender resides.
     */
    set sender(_sender) { this.#sender = _sender; }
    /**
     * @param {HTMLElement} _replyTo The HTMLElement where the replyTo resides.
     */
    set replyTo(_replyTo) { this.#replyTo = _replyTo; }
    /**
     * @param {HTMLElement} _subject The HTMLElement where the subject resides.
     */
    set subject(_subject) { this.#subject = _subject; }
    /**
     * @param {HTMLElement} _body The HTMLElement where the body resides.
     */
    set body(_body) { this.#body = _body; }
    /**
     * @param {HTMLElement} _pm
     */
    set parentMarker(_pm) { this.#parentMarker = _pm; }

    get page() { return this.page; }
    get sender() { return this.#sender; }
    get replyTo() { return this.#replyTo; }
    get subject() { return this.#subject; }
    get body() { return this.#body; }
    get marker() { return this.#marker; }

    get emailPayload() {
        return {
            sender: this.#sender,
            replyTo: this.#replyTo,
            subject: this.#subject,
            body: this.#body
        };
    }
}