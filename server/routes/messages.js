const express = require("express");
const router = express.Router();
const data = require("../src/temporaryData");
const { compose } = require("ramda");
const sendMessage = require("../src/sendMessage");
const { DIRECTION, TYPING, INTEGRATION } = require("../src/constants");
const {
  setDataAndClearTimeoutSendRes,
  appendMessage,
  responseErrorIfNotEqualsMessages,
  responseSuccess,
  omitAttributesForEquals,
  responseErrorIfIntegrationNotEqualsTranscript,
} = require("../src/utils");

const { IN, OUT } = DIRECTION;

const isEndOfTranscript = (transcript, index) =>
  transcript.length === index + 1;

router.post("/", async function (req, res, next) {
  const { testId } = req.query;
  const temporaryData = data.get(testId);
  const { apiUrl, index, transcript } = temporaryData;

  const { text, type } = req.body;

  if (type === TYPING) {
    res.sendStatus(200);
  } else {
    if (type === INTEGRATION || transcript[index]?.Type === INTEGRATION) {
      if (type !== INTEGRATION) {
        responseErrorIfIntegrationNotEqualsTranscript(
          temporaryData,
          res,
          req.body,
          type
        );
      } else if (
        type === INTEGRATION &&
        transcript[index]?.Type === INTEGRATION
      ) {
        setDataAndClearTimeoutSendRes(
          testId,
          temporaryData,
          res,
          1,
          appendMessage({
            direction: INTEGRATION,
            text: transcript[index]?.ResponseBody,
            url: transcript[index]?.Url,
          }),
          {
            ...transcript[index]?.ResponseBody,
          }
        );
      }
    } else if (transcript[index]?.Direction === IN) {
      await sendMessage(
        apiUrl,
        transcript[index]?.Text,
        testId,
        req.headers.host
      );
      setDataAndClearTimeoutSendRes(
        testId,
        temporaryData,
        res,
        2,
        appendMessage({
          direction: IN,
          text: transcript[index]?.Text,
        })
      );
    } else if (transcript[index]?.Direction === OUT) {
      const omitReqBody = omitAttributesForEquals(req.body);

      responseErrorIfNotEqualsMessages(temporaryData, text, res, omitReqBody);

      if (transcript[index + 1]?.Direction === OUT) {
        setDataAndClearTimeoutSendRes(
          testId,
          temporaryData,
          res,
          1,
          appendMessage({
            direction: OUT,
            message: omitReqBody,
          })
        );
      } else if (transcript[index + 1]?.Direction === IN) {
        const appendOutInMessages = compose(
          appendMessage({
            direction: IN,
            text: transcript[index + 1]?.Text,
          }),
          appendMessage({
            direction: OUT,
            message: omitReqBody,
          })
        );

        await sendMessage(
          apiUrl,
          transcript[index + 1]?.Text,
          testId,
          req.headers.host
        );
        setDataAndClearTimeoutSendRes(
          testId,
          temporaryData,
          res,
          2,
          appendOutInMessages
        );
      }

      if (isEndOfTranscript(transcript, index)) {
        responseSuccess(temporaryData, res, text, req.body);
      }
    }
  }
});

module.exports = router;
