const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const data = require("../src/temporaryData");
const { makeId, addTimeDiffForTranscript } = require("../src/utils");
const {
  compose,
  reverse,
  reject,
  propEq,
  both,
  isEmpty,
  sortBy,
  prop,
} = require("ramda");
const beginIntroDialog = require("../src/beginIntroDialog");
const { TIME_OF_TIMEOUT } = require("../src/constants");

const removeTestInfoMessage = reject(
  propEq(
    "Text",
    "Chatbot je spuštěn v TESTOVACÍM režimu, žádné emaily nebudou odesílány."
  )
);
const removeTestInfoEnMessage = reject(
  propEq(
    "Text",
    "The chatbot is running in the TEST mode, results won't be saved and no emails will be sent."
  )
);
const reverseAndFilterEmptyMessages = compose(
  sortBy(prop("Timestamp")),
  removeTestInfoEnMessage,
  removeTestInfoMessage,
  reject(both(propEq("Text", ""), propEq("Direction", "in"))),
  reverse
);

router.post("/", async function (req, res, next) {
  const { apiUrl, userId } = req.query;
  const testId = makeId();

  const transcriptResponse = await fetch(
    `${apiUrl}/api/management/transcript/users/${userId}?code=${process.env.AUTH_CODE}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  const integrationMockerResponse = await fetch(
    `${apiUrl}/api/management/integration-mocker/users/${userId}?code=${process.env.AUTH_CODE}`,
    {
      headers: {
        accept: "application/json",
      },
    }
  );

  const reversedTranscript = await transcriptResponse.json();

  if (!reversedTranscript || isEmpty(reversedTranscript)) {
    res.json({ error: "empty transcript" });
  }

  const integrationMocker = await integrationMockerResponse.json();
  const mergedTranscriptAndIntegrations = [
    ...integrationMocker,
    ...reversedTranscript,
  ];

  const transcript = reverseAndFilterEmptyMessages(
    mergedTranscriptAndIntegrations
  );
  const transcriptWithTimeDiff =
    addTimeDiffForTranscript(transcript)(transcript);

  data.set(testId, {
    mainRes: res,
    transcript: transcriptWithTimeDiff,
    index: 0,
    apiUrl,
    timeout: setTimeout(() => res.json({ error: "timeout" }), TIME_OF_TIMEOUT),
  });
  await beginIntroDialog(apiUrl, testId, req.headers.host);
});

module.exports = router;
