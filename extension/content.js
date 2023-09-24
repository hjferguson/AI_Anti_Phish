console.log("content.js file is running");

console.log("Before DOM", window);
window.addEventListener("hashchange", () => {
  console.log("hashchange recorded");
  shouldTriggerExtension(document.URL); //this is printing correct url now
});

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Loaded", window);
  document.addEventListener("click", () => {
    // console.log("clicked the dom");
    //shouldTriggerExtension(document.URL); //this is capturing inbox url then switching to email
  });
});


function shouldTriggerExtension(currentUrl) {
    console.log("triggered check for individual email")
    console.log("target slice: ", currentUrl.slice(-5));
    //document.URL
    if(currentUrl.slice(-5) === "inbox") {
       var isInInbox = true
      } else { 
        var isInInbox = false
      } 
    console.log("we are in inbox?", isInInbox);

    //const isViewingEmail = isInInbox && !!currentUrl.match(/\/#inbox\/.+/);
    if(isInInbox === false){
      
      console.log('isInInbox:', isInInbox);
      console.log('currentUrl:', currentUrl);
      console.log("EXECUTE extraction now.")
      //sender
      const spanElement = document.querySelector('.go');
      const emailSender = spanElement ? spanElement.textContent : null;
      console.log("Email sender: ",emailSender);
      //subject
      const subjectDiv = document.querySelector('.ha h2');
      const subject = subjectDiv ? subjectDiv.textContent : null;
      console.log("Subject :", subject);
      //body
      const emailBodyContainer = document.querySelector('.gs');
      const emailBody = emailBodyContainer ? emailBodyContainer.innerText : null;
      console.log("Email body: ", emailBody)
      //replyto?
      const replySpan = document.querySelector('.ajB.gt .ajC tbody .ajv .gL .gI span');
      const replyToEmail = replySpan ? replySpan.innerText : null;
      console.log("replyto: ", replyToEmail);





    }
    


    // if (isViewingEmail) {
    //   console.log("execute extraction here");
    //   // Call extractEmailInfo() function here

    // }
}





// Function to extract email information and communicate with the background script
function extractEmailInfo() {
  
  const sender = document.querySelector("<selector for sender>").textContent;
  //write checks for whitelist/blacklist. If whitelist, stop program, if blacklist, warn user

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