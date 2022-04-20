const data = require("../src/temporaryData");
const { append, compose, propOr, addIndex, map, omit } = require("ramda");
const { TIME_OF_TIMEOUT, INTEGRATION } = require("./constants");
const { DIRECTION } = require("../src/constants");

const { OUT } = DIRECTION;

const makeId = () => {
  let text = "test-";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 11; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

const appendMessage = ({
  timestamp = new Date(),
  direction,
  message,
  url,
  timeDiff,
  text,
}) =>
  append({
    direction,
    timestamp,
    message,
    url,
    timeDiff,
    text,
  });

const setDataAndClearTimeoutSendRes = (
  testId,
  temporaryData,
  res,
  indexInc,
  makeConversation,
  responseContent
) => {
  const { index, mainRes, conversation, timeout } = temporaryData;

  clearTimeout(timeout);
  data.set(testId, {
    ...temporaryData,
    index: index + indexInc,
    conversation: makeConversation(conversation),
    timeout: setTimeout(
      () => mainRes.json({ error: "timeout" }),
      TIME_OF_TIMEOUT
    ),
  });

  if (responseContent) {
    res.json(responseContent);
  } else {
    res.sendStatus(200);
  }
};

const directionP = propOr(false, "direction");
const mapIndexed = addIndex(map);
const timeDiffP = propOr(false, "timeDiff");

const addTimeDiff = (conversation) =>
  mapIndexed((item, idx) => {
    if (directionP(item) === OUT && directionP(conversation[idx - 1]) === OUT) {
      const timeDiff =
        new Date(item.timestamp) - new Date(conversation[idx - 1].timestamp);
      return { ...item, timeDiff };
    }
    return item;
  });

const directionTranscriptP = propOr(false, "Direction");

const addTimeDiffForTranscript = (transcript) =>
  mapIndexed((item, idx) => {
    if (
      directionTranscriptP(item) === "out" &&
      directionTranscriptP(transcript[idx - 1]) === "out"
    ) {
      const timeDiff =
        new Date(item.Timestamp) - new Date(transcript[idx - 1].Timestamp);
      return { timeDiff, ...item };
    }
    return item;
  });

const addTimeDiffBetweenTranscript = (transcript) =>
  mapIndexed((item, idx) => {
    if (timeDiffP(item)) {
      const timeDiffTranscript = timeDiffP(item) - timeDiffP(transcript[idx]);
      return { ...item, timeDiffTranscript };
    }
    return item;
  });

const getConversationWithTimeDiffTranscript = (conversation, transcript) =>
  compose(addTimeDiffBetweenTranscript(transcript), addTimeDiff(conversation));

const omitAttributesForEquals = omit([
  "agent",
  "source",
  "address",
  "sourceEvent",
  "textLocale",
  "attachments",
  "suggestedActions",
]);
const responseErrorIfIntegrationNotEqualsTranscript = (
  temporaryData,
  res,
  message,
  type
) => {
  const { apiUrl, index, transcript, mainRes, conversation } = temporaryData;

  const conversationWithLastMessage = appendMessage({
    direction: OUT,
    message,
  })(conversation);

  const conversationWithTimeDiffTranscript =
    getConversationWithTimeDiffTranscript(
      conversationWithLastMessage,
      transcript
    )(conversationWithLastMessage);

  mainRes.json({
    error: `According to the transcript, integration is expected, but a ${type} has arrived.`,
    data: {
      apiUrl,
      index: index + 1,
      transcript,
      conversation: conversationWithTimeDiffTranscript,
    },
  });
  res.sendStatus(200);
};

const responseErrorIfNotEqualsMessages = (
  temporaryData,
  text,
  res,
  message
) => {
  const { apiUrl, index, transcript, mainRes, conversation } = temporaryData;

  const omitTranscript = omitAttributesForEquals(transcript[index]?.Message);

  const conversationWithLastMessage = appendMessage({
    direction: OUT,
    text,
    message,
  })(conversation);

  if (
    JSON.stringify(
      conversationWithLastMessage[conversationWithLastMessage.length - 1]
        .message
    ) !== JSON.stringify(omitTranscript)
  ) {
    const conversationWithTimeDiffTranscript =
      getConversationWithTimeDiffTranscript(
        conversationWithLastMessage,
        transcript
      )(conversationWithLastMessage);

    mainRes.json({
      error: `JSON message not equals JSON from transcript`,
      data: {
        apiUrl,
        index,
        transcript,
        conversation: conversationWithTimeDiffTranscript,
      },
    });
    res.sendStatus(200);
  }
};

const responseSuccess = (temporaryData, res, text, message) => {
  const { apiUrl, index, transcript, mainRes, conversation } = temporaryData;

  const conversationWithLastMessage = appendMessage({
    direction: OUT,
    text,
    message,
  })(conversation);
  const conversationWithTimeDiffTranscript =
    getConversationWithTimeDiffTranscript(
      conversationWithLastMessage,
      transcript
    )(conversationWithLastMessage);

  mainRes.json({
    info: "Testing was successful.",
    data: {
      apiUrl,
      index,
      transcript,
      conversation: conversationWithTimeDiffTranscript,
    },
  });
  res.sendStatus(200);
};

module.exports = {
  makeId,
  setDataAndClearTimeoutSendRes,
  appendMessage,
  responseErrorIfNotEqualsMessages,
  responseSuccess,
  addTimeDiffForTranscript,
  omitAttributesForEquals,
  responseErrorIfIntegrationNotEqualsTranscript,
};
