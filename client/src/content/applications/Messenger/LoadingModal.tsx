import PropTypes from 'prop-types';
import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

export function LoadingModal({ open }) {
  return (
    <Dialog open={open}>
      <Box
        sx={{
          width: 500,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ alignItems: 'center' }}>
          <CircularProgress size={100} />
        </Box>
      </Box>
    </Dialog>
  );
}

LoadingModal.propTypes = {
  open: PropTypes.bool.isRequired
};
