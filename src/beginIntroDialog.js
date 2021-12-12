const fetch = require("node-fetch");

const beginIntroDialog = async (apiUrl, testId, ownUrl) => {
    await fetch(`${apiUrl}/api/messages/custom?code=${process.env.AUTH_CODE}`, {
        method: 'post',
        body: JSON.stringify({
            "type": "event",
            "name": "beginIntroDialog",
            "address": {
                "user": {
                    "id": testId
                },
                "conversation": {
                    "id": testId
                },
                "serviceUrl": `http://${ownUrl}/messages?testId=${testId}`
            },
            "channelData": {
                "id": "intro-dialog",
                "userData": {
                    "email": "some@email.com"
                },
            }
        }),
        headers: {'Content-Type': 'application/json'}
    });
}

module.exports = beginIntroDialog;
