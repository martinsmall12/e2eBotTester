const fetch = require("node-fetch");

const sendMessage = async (apiUrl, text, testId, ownUrl) => {
    await fetch(`${apiUrl}/api/messages/custom?code=${process.env.AUTH_CODE}`, {
        method: 'post',
        body: JSON.stringify({
            "type": "message",
            "text": text,
            "address": {
                "user": {
                    "id": testId
                },
                "conversation": {
                    "id": testId
                },
                "serviceUrl": `http://${ownUrl}/messages?testId=${testId}`
            }
        }),
        headers: {'Content-Type': 'application/json'}
    });
}

module.exports  = sendMessage;
