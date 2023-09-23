function shouldTriggerExtension() {
    const gmailPattern = /mail\.google\.com\/.*\/mail/;
    const outlookPattern = /outlook\.live\.com/;
    const yahooPattern = /mail\.yahoo\.com/;
  
    //.test() returns boolean if pattern matches or not
    const isGmail = gmailPattern.test(window.location.href); //window.locations.href grabs current url
    const isOutlook = outlookPattern.test(window.location.href);
    const isYahoo = yahooPattern.test(window.location.href);

    if (isGmail){
        const isInInbox = window.location.href.includes("/#inbox");
        const isViewingEmail = !isInInbox || window.location.href.match(/\/#inbox\/.+/);
        if(isViewingEmail){
            extractEmailInfo();
        } //returns true/false
    }
  
    
  
    if (isEmailProviderSite && isViewingEmail){
        extractEmailInfo(); 
    }

    return isEmailProviderSite && isViewingEmail;
  }
  
  
  //function that checks if gmail email is open

  
  
  // Function to extract email information and communicate with the background script
  function extractEmailInfo() {
    if (shouldTriggerExtension()) {
      const sender = document.querySelector("<selector for sender>").textContent;
      const body = document.querySelector("<selector for body>").textContent;
  
      // Extract links from the body
      const links = [];
      const linkElements = document.querySelectorAll("<selector for links>");
      linkElements.forEach((linkElement) => {
        links.push(linkElement.href);
      });
  
      const emailInfo = {
        sender,
        body,
        links,
      };
  
      // Send the extracted data to the background script
      chrome.runtime.sendMessage({ action: "extractEmailInfo", emailInfo });
    }
  }
  
  // Automatically extract information when the content script is loaded




  