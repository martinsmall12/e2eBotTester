import React, { useState } from 'react';
import { getDateFormat } from './utils';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton
} from '@mui/material';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import { styled } from '@mui/material/styles';
import Label from '../../../components/Label';
import { JsonDiffModal } from './JsonDiffModal';
import CodeIcon from '@mui/icons-material/Code';
import { IntegrationModal } from './IntegrationModal';

export type MessageProps = {
  text: string;
  timestamp: number;
  attachments?: any[];
  timeDiffTranscript?: number;
  message?: any;
  transcript?: any;
  index?: number;
  isLastMessage?: boolean;
};

export type IntegrationMessageProps = {
  text: string;
  timestamp: number;
  url: string;
  message?: any;
  transcript?: any;
  index?: number;
};

const CardWrapperSecondary = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.alpha.black[10]};
      color: ${theme.colors.alpha.black[100]};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-left-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

const CardWrapperSecondaryError = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.error.main};
      color: ${theme.colors.alpha.white[100]};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-left-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

const CardWrapperPrimary = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-right-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

const CardWrapperIntegration = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.alpha.trueWhite};
      color: ${theme.palette.primary.contrastText};
      padding: ${theme.spacing(2)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-right-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

export const MessageLeft: React.FC<MessageProps> = ({
  text,
  timestamp,
  timeDiffTranscript,
  message,
  transcript,
  index,
  isLastMessage
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      py={3}
    >
      <Avatar
        variant="rounded"
        sx={{ width: 50, height: 50 }}
        alt="Zain Baptista"
        src="/static/images/avatars/4.jpg"
      />
      <Box
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        justifyContent="flex-start"
        ml={2}
      >
        {isLastMessage && (
          <CardWrapperSecondaryError>
            {text}
            <IconButton
              aria-label="delete"
              size="small"
              onClick={handleClickOpen}
            >
              <CodeIcon fontSize="inherit" />
            </IconButton>
          </CardWrapperSecondaryError>
        )}
        {!isLastMessage && (
          <CardWrapperSecondary>
            {text}
            <IconButton
              aria-label="delete"
              size="small"
              onClick={handleClickOpen}
            >
              <CodeIcon fontSize="inherit" />
            </IconButton>
          </CardWrapperSecondary>
        )}

        <Typography
          variant="subtitle1"
          sx={{ pt: 1, display: 'flex', alignItems: 'center' }}
        >
          <ScheduleTwoToneIcon sx={{ mr: 0.5 }} fontSize="small" />
          {getDateFormat(timestamp)}{' '}
          {timeDiffTranscript && (
            <Label color={timeDiffTranscript > 0 ? 'success' : 'error'}>
              {timeDiffTranscript}
            </Label>
          )}
        </Typography>
      </Box>
      <JsonDiffModal
        open={open}
        onClose={handleClose}
        message={message}
        transcript={transcript[index]}
      />
    </Box>
  );
};

export const MessageRight: React.FC<MessageProps> = ({ text, timestamp }) => {
  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-end"
      py={3}
    >
      <Box
        display="flex"
        alignItems="flex-end"
        flexDirection="column"
        justifyContent="flex-end"
        mr={2}
      >
        <CardWrapperPrimary>{text}</CardWrapperPrimary>
        <Typography
          variant="subtitle1"
          sx={{ pt: 1, display: 'flex', alignItems: 'center' }}
        >
          <ScheduleTwoToneIcon sx={{ mr: 0.5 }} fontSize="small" />
          {getDateFormat(timestamp)}
        </Typography>
      </Box>
      <Avatar
        variant="rounded"
        sx={{ width: 50, height: 50 }}
        alt="Zain Baptista"
        src="/static/images/avatars/2.jpg"
      />
    </Box>
  );
};

export const IntegrationMessage: React.FC<IntegrationMessageProps> = ({
  url,
  text,
  timestamp,
  message,
  transcript,
  index
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      py={3}
    >
      <Avatar
        variant="rounded"
        sx={{ width: 50, height: 50 }}
        alt="Zain Baptista"
        src="/static/images/avatars/5.jpg"
      />
      <Box
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        justifyContent="flex-start"
        ml={2}
      >
        <CardWrapperIntegration>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            <a href={url}>{url}</a>
          </Typography>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={handleClickOpen}
          >
            <CodeIcon fontSize="inherit" />
          </IconButton>
        </CardWrapperIntegration>
        <Typography
          variant="subtitle1"
          sx={{ pt: 1, display: 'flex', alignItems: 'center' }}
        >
          <ScheduleTwoToneIcon sx={{ mr: 0.5 }} fontSize="small" />
          {getDateFormat(timestamp)}
        </Typography>
      </Box>
      <IntegrationModal
        open={open}
        onClose={handleClose}
        message={message}
        transcript={transcript[index]}
      />
    </Box>
  );
};
