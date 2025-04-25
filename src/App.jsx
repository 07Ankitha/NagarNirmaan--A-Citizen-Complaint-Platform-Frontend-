import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Import your components
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard Pages
import AdminDashboard from "./pages/AdminDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";

// Complaints
import ComplaintForm from "./pages/ComplaintForm";
import AdminLoginPage from "./pages/AdminLogin";
import ComplaintDetails from "./pages/ComplaintDetails";
import NotificationsPage from "./pages/Notifications";
import AddAdminPage from "./pages/AddAdminPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute requiredRole="citizen">
                  <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/notification"
            element={
              <ProtectedRoute requiredRole="citizen">
                  <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/citizen/complaint/new"
            element={
              <ProtectedRoute requiredRole="citizen">
                <ComplaintForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddAdminPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/complaints/status"
            element={
              <ProtectedRoute requiredRole="citizen">
                <ComplaintStatus />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
