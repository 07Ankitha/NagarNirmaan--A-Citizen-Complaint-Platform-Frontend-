import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button, Box } from "@mui/material";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            You don't have permission to access this page. Please contact the
            administrator if you believe this is an error.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
