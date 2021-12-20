const express = require('express');
const router = express.Router();
const data = require("../src/temporaryData");
const {isEmpty, append} = require('ramda');
const sendMessage = require("../src/sendMessage");

const TYPING = 'typing';
const DIRECTION = {OUT: 'out', IN: 'in'};

const TIME_OF_TIMEOUT = 3000;

const {IN, OUT} = DIRECTION;
const appendMessage = (direction, text, attachments) => append({
    direction,
    timestamp: new Date(),
    text,
    attachments
})

router.post('/', async function (req, res, next) {
    const {testId} = req.query;
    const temporaryData = data.get(testId);
    const {apiUrl, index, transcript, mainRes, conversation, timeout} = temporaryData;

    const {text, type, attachments} = req.body;

    if (type === TYPING) {
        res.send(200)
    } else {
        if (transcript[index]?.Direction === IN) {
            await sendMessage(apiUrl, transcript[index]?.Text, testId, req.headers.host);
            clearTimeout(timeout)
            data.set(testId, {
                ...temporaryData,
                index: index + 2,
                conversation: appendMessage(IN, transcript[index]?.Text)(conversation),
                timeout: setTimeout(() => mainRes.json({ error: 'timeout' }), TIME_OF_TIMEOUT)
            })
            res.send(200)
        } else if (transcript[index]?.Direction === OUT) {
            clearTimeout(timeout)
            if (!attachments && !isEmpty(text)) {
                if (text !== transcript[index]?.Text) {
                    const {apiUrl, index, transcript, conversation} = temporaryData;
                    mainRes.json({
                        error: `Message: ${text} not equals message: ${transcript[index].Text}`,
                        data: {
                            apiUrl,
                            index,
                            transcript,
                            conversation: appendMessage(OUT, text, attachments)(conversation)
                        }
                    })
                    res.send(200);
                }
            }

            if (transcript.length === index + 1) {
                const {apiUrl, index, transcript, conversation} = temporaryData;
                mainRes.json({
                    info: 'Testing was successful.',
                    data: {apiUrl, index, transcript, conversation: appendMessage(OUT, text, attachments)(conversation)}
                });
                res.send(200)
            }

            if (transcript[index + 1]?.Direction === OUT) {
                clearTimeout(timeout)
                data.set(testId, {
                    ...temporaryData, index: index + 1,
                    conversation: appendMessage(OUT, text, attachments)(conversation),
                    timeout: setTimeout(() => mainRes.json({ error: 'timeout' }), TIME_OF_TIMEOUT)
                })
                res.send(200)

            } else if (transcript[index + 1]?.Direction === IN) {
                await sendMessage(apiUrl, transcript[index + 1]?.Text, testId, req.headers.host);
                clearTimeout(timeout)
                data.set(testId, {
                    ...temporaryData,
                    index: index + 2,
                    conversation: appendMessage(IN, transcript[index + 1]?.Text, attachments)(conversation),
                    timeout: setTimeout(() => mainRes.json({ error: 'timeout' }), TIME_OF_TIMEOUT)
                })
                res.send(200)
            }
        }
    }
});

module.exports = router;
