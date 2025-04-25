import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useFormik } from "formik";
import * as yup from "yup";
import Footer from "../components/Footer";
import HeaderComponent from "../components/HeaderComponent";

const validationSchema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "citizen", // Hardcoded role
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch("https://nagarnirmaan-backend.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          login(data.token, data.user);

          if (data.user.role === "citizen") {
            navigate("/citizen/dashboard", { replace: true });
          } else if (data.user.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          }
        } else {
          throw new Error("Invalid credentials. Please try again.");
        }
      } catch (err) {
        setError(err.message);
      }
    },
  });

  return (
    <>
    <HeaderComponent />
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        padding: 2,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, textAlign: "center", color: "gray" }}>
            Your voice matters. Log in to make a difference in your community.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 3 }}
              InputProps={{ sx: { fontSize: "1.1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1.1rem" } }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 3 }}
              InputProps={{ sx: { fontSize: "1.1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1.1rem" } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mb: 2, fontSize: "1.1rem", padding: "10px 0" }}
            >
              Sign In
            </Button>

            <Button
              fullWidth
              variant="text"
              size="large"
              onClick={() => navigate("/register")}
              sx={{ mb: 1, fontSize: "1rem" }}
            >
              Don't have an account? Sign Up
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate("/admin-login")}
              sx={{ fontSize: "1rem", mt: 1 }}
            >
              Admin Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
    <Footer/>
    </>
  );
};

export default LoginPage;
