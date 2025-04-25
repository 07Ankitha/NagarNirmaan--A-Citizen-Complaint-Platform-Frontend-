import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const validationSchema = yup.object({
  fullName: yup
    .string()
    .required("Full Name is required")
    .min(2, "Name should be of minimum 2 characters length"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "https://nagarnirmaan-backend.onrender.com/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.fullName,
              email: values.email,
              password: values.password,
              role: "citizen",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        });
      } catch (err) {
        setError("Registration failed. Please try again.");
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: "0 0 35%",
          background: "linear-gradient(135deg, #4338CA, #3B82F6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "2rem",
          position: "relative",
        }}
      >
        <RocketLaunchIcon sx={{ fontSize: 60, mb: 2, color: "white" }} />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
          NagarNirmaan
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          At NagarNirmaan, we are committed to solving your problems with the
          best solutions tailored to your needs. Join us today to experience
          real-time solutions and help us make your life easier!
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            mt: 3,
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#f8fafc",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "450px" }}>

          <Typography variant="h4" sx={{ mb: 4, color: "#1E40AF" }}>
            Register to Solve Your Issues
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="First Name *"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Your Email *"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password *"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password *"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#3B82F6",
                "&:hover": { backgroundColor: "#2563EB" },
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Register
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
