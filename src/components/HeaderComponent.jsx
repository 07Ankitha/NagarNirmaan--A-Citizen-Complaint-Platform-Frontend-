import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const HeaderComponent = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ minHeight: "80px" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, fontWeight: "bold", fontSize: "2rem" }} // Increased font size
        >
          NagarNirmaan
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComponent;
