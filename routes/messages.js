const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')
const data = require("../src/temporaryData");
const {isEmpty} = require('ramda');

const TYPING = 'typing';
const DIRECTION = {OUT: 'out', IN: 'in'};

const {IN, OUT} = DIRECTION;

router.post('/', async function (req, res, next) {
    const {testId} = req.query;
    const temporaryData = data.get(testId);
    const {apiUrl, index, transcript, mainRes} = temporaryData;

    console.log(req.body);

    const {text, type, attachments} = req.body;

    if (type === TYPING) {
        res.send(200)
    } else {
        if (transcript[index].Direction ===  IN) {
            await fetch(`${apiUrl}/api/messages/custom?code=${process.env.AUTH_CODE}`, {
                method: 'post',
                body: JSON.stringify({
                    "type": "message",
                    "text": transcript[index].Text,
                    "address": {
                        "user": {
                            "id": testId
                        },
                        "conversation": {
                            "id": testId
                        },
                        "serviceUrl": `http://localhost:3000/messages?testId=${testId}`
                    }
                }),
                headers: {'Content-Type': 'application/json'}
            });
            data.set(testId, {...temporaryData, index: index+2 })
            res.json(200)
        } else if (transcript[index].Direction === OUT) {
            if(!attachments && !isEmpty(text)){
                if(text !== transcript[index].Text ){
                    mainRes.json({ error: 'Messages is not equals'})
                }
            }


            if(transcript.length === index+1) {
                mainRes.json({ info: 'Testing was successful.'})
            }

            if(transcript[index+1].Direction === OUT){
                data.set(testId, {...temporaryData, index: index+1 })
                res.json(200)

            } else {
                await fetch(`${apiUrl}/api/messages/custom?code=${process.env.AUTH_CODE}`, {
                    method: 'post',
                    body: JSON.stringify({
                        "type": "message",
                        "text": transcript[index+1].Text,
                        "address": {
                            "user": {
                                "id": testId
                            },
                            "conversation": {
                                "id": testId
                            },
                            "serviceUrl": `http://localhost:3000/messages?testId=${testId}`
                        }
                    }),
                    headers: {'Content-Type': 'application/json'}
                });
                data.set(testId, {...temporaryData, index: index+2 })
            }
        }
    }

});

module.exports = router;
