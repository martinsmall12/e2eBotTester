import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Skeleton,
  Stack
} from '@mui/material';

import { IntegrationMessage, MessageLeft, MessageRight } from './message';
import React from 'react';

function ChatContent({ data }) {
  return (
    <>
      <Box p={3}>
        {data?.data?.conversation?.map((conversation: any, index) => {
          return conversation.direction === 'in' ? (
            <MessageRight
              text={conversation.text}
              timestamp={conversation.timestamp}
              key={`${index}`}
            />
          ) : conversation.direction === 'out' ? (
            <MessageLeft
              text={conversation.message?.text}
              timestamp={conversation.timestamp}
              key={`${index}`}
              timeDiffTranscript={conversation.timeDiffTranscript}
              message={conversation}
              transcript={data?.data.transcript}
              index={index}
              isLastMessage={
                index === data?.data?.conversation.length - 1 && data?.error
              }
            />
          ) : (
            <IntegrationMessage
              text={JSON.stringify(conversation.text)}
              timestamp={conversation.timestamp}
              key={`${index}`}
              url={conversation.url}
              message={conversation}
              transcript={data?.data.transcript}
              index={index}
            />
          );
        })}
      </Box>
      {data?.info && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {data?.info}
        </Alert>
      )}
      {data?.error && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {data?.error}
        </Alert>
      )}
    </>
  );
}

export default ChatContent;
