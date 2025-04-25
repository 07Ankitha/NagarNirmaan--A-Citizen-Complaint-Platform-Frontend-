import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import Footer from "../components/Footer";
import AdminHeaderComponent from "../components/AdminHeaderComponent";

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://nagarnirmaan-backend.onrender.com/api/complaints/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaint(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch complaint details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!complaint)
    return (
      <Typography variant="h6" align="center" mt={10}>
        Complaint not found.
      </Typography>
    );

  return (
    <>
    <AdminHeaderComponent />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 1000,
            width: "100%",
            borderRadius: 4,
            p: 4,
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold" }}
          >
            {complaint.title}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {complaint.description}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Address
              </Typography>
              <Typography variant="body2" paragraph>
                {complaint.address}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Phone
              </Typography>
              <Typography variant="body2" paragraph>
                {complaint.phoneNumber}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                City
              </Typography>
              <Typography variant="body2" paragraph>
                {complaint.city}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Coordinates
              </Typography>
              <Typography variant="body2" paragraph>
                {complaint.latitude}, {complaint.longitude}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Created At
              </Typography>
              <Typography variant="body2">
                {new Date(complaint.createdAt).toLocaleString()}
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={5}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <Box
                component="img"
                src={`https://nagarnirmaan-backend.onrender.com/${complaint.imageUrl}`}
                alt="Complaint"
                sx={{
                  width: "100%",
                  maxHeight: 350,
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              />

              <Box sx={{ mt: 2 }}>
                <iframe
                  title="Google Map"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  style={{ borderRadius: 8, border: 0, width: "100%" }}
                  src={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}&hl=es;z=14&output=embed`}
                  allowFullScreen
                />
              </Box>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
        {/* <Footer /> */}
      </Box>
      <Footer />
    </>
  );
};

export default ComplaintDetails;
