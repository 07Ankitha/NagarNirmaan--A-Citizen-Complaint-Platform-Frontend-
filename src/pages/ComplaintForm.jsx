import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Snackbar, // Import Snackbar
  IconButton, // Import IconButton
} from "@mui/material";
import { Close } from "@mui/icons-material"; // Import Close icon
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Footer from "../components/Footer";
import HeaderComponent1 from "../components/HeaderComponent1";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  title: yup.string().required("Title is required").min(5),
  description: yup.string().required("Description is required").min(20),
  category: yup.string().required("Category is required"),
  city: yup.string().required("City is required"),
});

const ComplaintForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectedCityCoordinates, setSelectedCityCoordinates] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bangaloreLocations, setBangaloreLocations] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    },
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries: ["places"],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error("Location error:", err)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    const fetchBangaloreLocations = async () => {
      try {
        const response = await fetch(
          "https://nagarnirmaan-backend.onrender.com/api/locations"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBangaloreLocations(data);
      } catch (err) {
        console.error("Failed to fetch Bangalore locations:", err);
        setError("Failed to load Bangalore areas. Please try again later.");
      }
    };

    fetchBangaloreLocations();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: "",
      phoneNumber: "",
      title: "",
      description: "",
      category: "",
      city: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSubmissionStatus(null);

        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const selectedLocation = bangaloreLocations.find(
          (loc) => loc.name === values.city
        );
        if (selectedLocation) {
          formData.append("latitude", selectedLocation.latitude);
          formData.append("longitude", selectedLocation.longitude);
          formData.append("locationName", selectedLocation.name);
        } else if (location) {
          formData.append("latitude", location.lat);
          formData.append("longitude", location.lng);
        }

        if (image) formData.append("image", image);

        const response = await fetch(
          "https://nagarnirmaan-backend.onrender.com/api/complaints",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setSnackbarMessage("Complaint submitted successfully!");
        setOpenSnackbar(true);
        setSubmissionStatus({
          type: "success",
          message: "Complaint submitted successfully!",
          data: responseData,
        });
        formik.resetForm();
        setImage(null);
        setPreview(null);
      } catch (err) {
        setError("Failed to submit complaint. Please try again.");
        setSubmissionStatus({ type: "error", message: err.message });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCityChange = (event) => {
    formik.handleChange(event);
    const selectedCityName = event.target.value;
    const selectedLocation = bangaloreLocations.find(
      (loc) => loc.name === selectedCityName
    );
    setSelectedCityCoordinates(selectedLocation || null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const renderMap = () => {
    if (loadError) {
      return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
      return <CircularProgress />;
    }

    if (selectedCityCoordinates) {
      const { latitude, longitude } = selectedCityCoordinates;
      const zoomLevel = 14;

      return (
        <iframe
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoomLevel}&output=embed`}
          height={250}
          style={{ border: 0 }}
          width={"100%"}
          title="City Map"
          loading="lazy"
        />
      );
    }

    if (location) {
      return (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: 300 }}
          center={location}
          zoom={14}
        >
          <Marker
            position={location}
            draggable
            onDragEnd={(event) =>
              setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() })
            }
          />
        </GoogleMap>
      );
    }

    return <Typography color="text.secondary">Loading location...</Typography>;
  };

  return (
    <>
      <HeaderComponent1 />
      <Container maxWidth="md" sx={{ py: 5 }} maxHeight="90">
        <Paper elevation={4} sx={{ p: 5 }}>
          <Typography variant="h5" gutterBottom>
            Lodge a Complaint
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            Please provide all necessary details to help us serve you better.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {submissionStatus && submissionStatus.type === "error" && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {submissionStatus.message}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            {/* USER DETAILS */}
            <Typography variant="h6" gutterBottom>
              Your Details
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Your Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Your Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* COMPLAINT DETAILS */}
            <Typography variant="h6" gutterBottom>
              Complaint Information
            </Typography>

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                label="Category"
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
              >
                <MenuItem value="ROAD_ISSUES">Road Issues</MenuItem>
                <MenuItem value="WASTE_MANAGEMENT">Waste Management</MenuItem>
                <MenuItem value="WATER_SUPPLY">Water Supply</MenuItem>
                <MenuItem value="ELECTRICITY">Electricity</MenuItem>
                <MenuItem value="PUBLIC_SAFETY">Public Safety</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="title"
              name="title"
              label="Complaint Title"
              sx={{ mt: 2 }}
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              id="description"
              name="description"
              label="Description"
              sx={{ mt: 3 }}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />

            {/* CITY SELECTION */}
            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                id="city"
                name="city"
                value={formik.values.city}
                onChange={handleCityChange}
                label="City"
                error={formik.touched.city && Boolean(formik.errors.city)}
              >
                {bangaloreLocations.map((location) => (
                  <MenuItem key={location.id} value={location.name}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* IMAGE UPLOAD */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Image (Optional)
              </Typography>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Drag and drop an image here, or click to select
                  </Typography>
                )}
              </Box>
            </Box>

            {/* MAP LOCATION */}
            <Box sx={{ mt: 5 }}>
              <Typography variant="subtitle1" gutterBottom>
                Location
              </Typography>
              {renderMap()}
            </Box>

            {/* BUTTONS */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 5,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  formik.resetForm();
                  setSubmissionStatus(null);
                  setImage(null);
                  setPreview(null);
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Submit Complaint"}
              </Button>
            </Box>
          </form>
        </Paper>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <Close fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </Container>
      <Footer />
    </>
  );
};

export default ComplaintForm;
