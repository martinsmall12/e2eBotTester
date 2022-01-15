const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const data = require('../src/temporaryData');
const makeId = require('../src/utils');
const {compose, reverse, reject, propEq, both} = require('ramda');
const beginIntroDialog = require("../src/beginIntroDialog");

const removeTestInfoMessage = reject(propEq('Text', 'Chatbot je spuštěn v TESTOVACÍM režimu, žádné emaily nebudou odesílány.'))
const reverseAndFilterEmptyMessages = compose(removeTestInfoMessage, reject(both(propEq('Text', ''), propEq('Direction', 'in'))), reverse);

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

    data.set(testId, {mainRes: res, transcript, index: 0, apiUrl, timeout: setTimeout(() => res.json({ error: 'timeout' }), 3000)});
    await beginIntroDialog(apiUrl, testId, req.headers.host)
});

module.exports = router;
