chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log(request, sender);
    // if (!sender.tab) return;
    // mainExecution(sender.tab.url, request.document);
    // sendResponse({ res: "success" });
    if (!sender.type !== "gmail") return;
    sender.execute(document);
});