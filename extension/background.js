// background.js

async function sendEmailToAI(emailData) {
    try {
      const response = await fetch("http://your-ai-server-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const aiResponse = await response.json();
  
      // Handle the AI model's response here
      return aiResponse;
    } catch (error) {
      console.error("Error sending email to AI:", error);
      throw error;
    }
  }
  
  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "extractEmailInfo") {
      // Handle message if needed, but the actual extraction is done in the content script
    }
  });
  
  