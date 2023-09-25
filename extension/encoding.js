function encoder(emailInfo) {
    const encoded = btoa(emailInfo);
    return encoded;
}

function decoder(encodedEmailInfo) { // Changed the argument name to avoid confusion
    const decoded = atob(encodedEmailInfo);
    return decoded;
}

var emailInfo = "";

var output1 = encoder(emailInfo);
console.log(output1);

var output2 = decoder(output1); // Pass output1 as an argument to the decoder
console.log(output2);