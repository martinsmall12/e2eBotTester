import PropTypes from 'prop-types';
import React, { SyntheticEvent, useState } from 'react';
import { Box, FormGroup, FormControlLabel, Tab } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import JsonDiffReact from 'jsondiffpatch-react';
import Switch from '@mui/material/Switch';
import { omitAttributesForEquals } from './utils';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { TabPanel } from '@mui/lab';
import ReactJson from 'react-json-view';

export function JsonDiffModal({ onClose, open, message, transcript }) {
  const handleClose = () => {
    onClose();
  };

  const [value, setValue] = useState('1');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [annotated, setAnnotated] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>JSON overview</DialogTitle>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Original transcript" value="1" />
            <Tab label="Original message" value="2" />
            <Tab label="JSON comparison" value="3" />
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
        <TabPanel value="3">
          <Box sx={{ p: 2 }}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    value={show}
                    onChange={() => setShow(!show)}
                  />
                }
                label="show"
              />
              <FormControlLabel
                control={
                  <Switch
                    value={annotated}
                    onChange={() => setAnnotated(!annotated)}
                  />
                }
                label="annotated"
              />
            </FormGroup>
          </Box>
          <Box sx={{ p: 2 }}>
            <JsonDiffReact
              left={omitAttributesForEquals(message?.message)}
              right={omitAttributesForEquals(transcript.Message)}
              annotated={annotated}
              show={show}
              tips={'Original JSON is same as transcript JSON'}
            />
          </Box>
        </TabPanel>
      </TabContext>
    </Dialog>
  );
}

JsonDiffModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.object,
  transcript: PropTypes.object
};
