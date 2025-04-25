// src/components/Footer.js
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1976D2', // Blue color
        color: 'white',
        py: 1, // Vertical padding increased for more space
        position: 'sticky',
        bottom: 0,
        width: '100%',
      }}
    >
      {/* <Container> */}
        <Grid container justifyContent="space-between" alignItems="center" padding={2}>
          {/* Left Side: Website Name and Copyright */}
          <Grid item xs="auto">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              NagarNirmaan
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              © 2025 Ankitha. All rights reserved.
            </Typography>
          </Grid>

          {/* Right Side: Version */}
          <Grid item xs="auto">
            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
              Version: 0.0.1
            </Typography>
          </Grid>
        </Grid>
      {/* </Container> */}
    </Box>
  );
};

export default Footer;
