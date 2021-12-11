const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const data = require('../src/temporaryData');
const makeId = require('../src/utils');
const {compose, reverse, reject, propEq, both} = require('ramda');

const reverseAndFilterEmptyMessages = compose(reject(both(propEq('Text', ''), propEq('Direction', 'in'))), reverse);

router.post('/', async function (req, res, next) {
    const {apiUrl, userId} = req.query;
    const testId = makeId();

    const response = await fetch(`${apiUrl}/api/management/transcript/users/${userId}?code=${process.env.AUTH_CODE}`, {
        headers: {
            accept: 'application/json'
        }
    });

    const reversedTranscript = await response.json();
    if (!reversedTranscript) {
        res.json({error: 'empty transcript'})
    }

    const transcript = reverseAndFilterEmptyMessages(reversedTranscript);

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
                "serviceUrl": `http://localhost:3000/messages?testId=${testId}`
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

    data.set(testId, {mainRes: res, transcript, index: 1, apiUrl});

});

module.exports = router;
