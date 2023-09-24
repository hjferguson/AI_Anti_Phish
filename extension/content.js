
//sorry for cowboy code, i blame hackathon timeline
const TRUSTED_DOMAINS = [
  "google.com",
  "facebook.com",
  "twitter.com",
  "linkedin.com",
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "amazon.com",
  "microsoft.com",
  "apple.com",
  "instagram.com",
  "netflix.com",
  "firefox.com",
  "paypal.com",
  "dropbox.com",
  "ebay.com",
  "pinterest.com",
  "wordpress.com",
  "tumblr.com",
  "blogger.com",
  "wikipedia.org",
  "reddit.com",
  "github.com",
  "bitbucket.org",
  "gitlab.com",
  "stackoverflow.com",
  "quora.com",
  "medium.com",
  "slack.com",
  "spotify.com",
  "twitch.tv",
  "tiktok.com",
  "snapchat.com",
  "telegram.org",
  "whatsapp.com",
  "zoom.us",
  "discord.com",
  "airbnb.com",
  "booking.com",
  "expedia.com",
  "tripadvisor.com",
  "cnn.com",
  "bbc.com",
  "nytimes.com",
  "washingtonpost.com",
  "theguardian.com",
  "forbes.com",
  "bloomberg.com",
  "businessinsider.com",
  "techcrunch.com",
  "wired.com",
  "nationalgeographic.com",
  "nasa.gov",
  "imdb.com",
  "rottentomatoes.com",
  "metacritic.com",
  "fandom.com",
  "gamepedia.com",
  "ign.com",
  "gamespot.com",
  "pcgamer.com",
  "pcmag.com",
  "tomshardware.com",
  "cnet.com",
  "arstechnica.com",
  "techradar.com",
  "engadget.com",
  "theverge.com",
  "vice.com",
  "vox.com",
  "usatoday.com",
  "wsj.com",
  "foxnews.com",
  "nbcnews.com",
  "abcnews.go.com",
  "cbsnews.com",
  "huffpost.com",
  "buzzfeed.com",
]

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
    //console.log("triggered check for individual email")
    //console.log("target slice: ", currentUrl.slice(-5));
    //document.URL
    if(currentUrl.slice(-5) === "inbox") {
       var isInInbox = true
      } else { 
        var isInInbox = false
      } 
    //console.log("we are in inbox?", isInInbox);

    //const isViewingEmail = isInInbox && !!currentUrl.match(/\/#inbox\/.+/);
    if(isInInbox === false){
      //console.log("we enter the call to extractEmailInfo...");
      
      var wholeEmail = extractEmailInfo(); //returns list of strings
      const jsonwholeEmail = JSON.stringify(wholeEmail);

      // Using Fetch API
      fetch('https://your-api-endpoint.com/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonwholeEmail
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => console.error('Error:', error));

          }
          
      }


// Function to extract email information and communicate with the background script
function extractEmailInfo() {
  
  let wholeEmail = [];
  //first important detail is sender. need to grab and compare to whitelist
  const spanElement = document.querySelector('.go');
  const emailSender = spanElement ? spanElement.textContent : null;
  const cleanedEmailSender = emailSender.replace(/<|>/g, ''); //gmail displays sender in <>
  
  console.log("cleanedEmailSender within extract: ", cleanedEmailSender);
  console.log("bool of cleaned: ", isTrustedEmail(cleanedEmailSender));
  
  if(isTrustedEmail(cleanedEmailSender) === false){
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
    
    return wholeEmail = [cleanedEmailSender, subject, emailBody];

  }else{
    console.log("This domain is trusted! Powering down scans");
  }

  

  // // Send the extracted data to the background script
  // chrome.runtime.sendMessage({ action: "extractEmailInfo", emailInfo });
  
}

//tested, this works
function isTrustedEmail(emailSender) {
  const domain = emailSender.split('@')[1]; // Split by '@' and take the second part
  for (let i = 0; i < TRUSTED_DOMAINS.length; i++) {
    if (TRUSTED_DOMAINS[i] === domain) {
      return true;
    }
  }
  return false;
}

