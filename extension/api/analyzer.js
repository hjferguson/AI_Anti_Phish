/**
 * 
 * @param {object} _content Email payload object.
 * @returns {Promise} A promise with a json as the result of the API call.
 */
export async function checkData(_content) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(_content),
    };

    try {
        const response = await fetch("http://localhost:5000/api/check_email", options).catch((ex) => { console.error(ex); return false; });
        // if (!response || !response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        if (!response) return false;
        const responseData = await response.json().catch((ex) => { console.error(ex); return false; });
        return responseData;
    } catch (error) {
        console.error("Error sending email to AI:", error);
    }
}