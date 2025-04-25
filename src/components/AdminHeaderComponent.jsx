import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";

const AdminHeaderComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false); // close drawer after navigation
  };

  const drawerContent = (
    <Box
      sx={{
        width: 300,
        backgroundColor: "#ffffff", // white background
        color: "black",
        height: "100%",
      }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem
          button
          onClick={() => handleNavigation("/admin/dashboard")}
          sx={{
            backgroundColor: "#1976d2", // light blue
            borderBottom: "1px solid black",
            mb: 1,
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            sx={{ color: "black", fontSize: "1.2rem" }}
          />
        </ListItem>
  
        <ListItem
          button
          onClick={() => handleNavigation("/admin/add-admin")}
          sx={{
            backgroundColor: "#1976d2", // light blue
            borderBottom: "1px solid black",
          }}
        >
          <ListItemIcon>
            <PersonAddIcon sx={{ color: "black" }} />
          </ListItemIcon>
          <ListItemText
            primary="Add Admin"
            sx={{ color: "black", fontSize: "1.2rem" }}
          />
        </ListItem>
      </List>
    </Box>
  );
  

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar sx={{ minHeight: "120px" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", fontSize: "2rem" }}
          >
            NagarNirmaan - Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default AdminHeaderComponent;
