console.log("content.js file is running");

// console.log(document.body);
// document.addEventListener("DOMContentLoaded", () => {
//   console.log(document.body.querySelectorAll("tr"))
// })
// console.log(document.body.querySelectorAll("tr"))
// document.body.querySelectorAll("tr")
console.log("Before DOM", window);
window.addEventListener("hashchange", () => {
  console.log("change");
});

document.addEventListener('DOMContentLoaded', function() {
  // console.log(document.body);
  // document.body.addEventListener('click', function() {
  //   console.log("clicking!")
  //   const currentUrl = window.location.href;
  //   // Run your code here to check the URL or do other tasks
  //   shouldTriggerExtension(currentUrl);
  // });
  // console.log(document.body.querySelectorAll("tr"));
  console.log("DOM Loaded", window);
  document.addEventListener("click", () => {
    // console.log("clicked the dom");
    shouldTriggerExtension(document.URL);
  });
});


function shouldTriggerExtension(currentUrl) {
  const gmailPattern = /mail\.google\.com\/mail\/u\/\d+/;
  const isGmail = gmailPattern.test(currentUrl);
  console.log("we are in gmail?", isGmail);

  if (isGmail) {
    const isInInbox = currentUrl.includes("/#inbox");
    console.log("we are in inbox?", isInInbox);

    const isViewingEmail = isInInbox && !!currentUrl.match(/\/#inbox\/.+/);
    console.log("we are viewing an individual email?", isViewingEmail);

    if (isViewingEmail) {
      console.log("execute extraction here");
      // Call extractEmailInfo() function here
    }
  }
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
