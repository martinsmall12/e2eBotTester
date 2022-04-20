import PropTypes from 'prop-types';
import React, { SyntheticEvent, useState } from 'react';
import { Box, Tab } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { TabPanel } from '@mui/lab';
import ReactJson from 'react-json-view';

export function IntegrationModal({ onClose, open, message, transcript }) {
  const handleClose = () => {
    onClose();
  };

  const [value, setValue] = useState('1');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>JSON overview</DialogTitle>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Transcript" value="1" />
            <Tab label="Original" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box sx={{ p: 2 }}>
            <ReactJson src={transcript} enableClipboard={false} />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ p: 2 }}>
            <ReactJson src={message} enableClipboard={false} />
          </Box>
        </TabPanel>
      </TabContext>
    </Dialog>
  );
}

IntegrationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.object,
  transcript: PropTypes.object
};
