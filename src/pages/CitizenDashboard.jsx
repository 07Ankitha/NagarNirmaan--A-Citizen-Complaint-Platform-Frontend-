import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../contexts/AuthContext"; //  Assuming this provides the user
import Footer from "../components/Footer";
import HeaderComponent1 from "../components/HeaderComponent1";
import ComplaintDetailsModal from "../modals/ComplaintDetailsModal";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from context
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) {
        // Redirect to login if the user is not logged in
        navigate("/login"); // Adjust the path as necessary
        return;
      }
      try {
        const response = await fetch(
          `https://nagarnirmaan-backend.onrender.com/api/complaints/user`,
          {
            //  Corrected endpoint
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, //  Make sure token is available
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch complaints: ${response.status}`);
        }

        const data = await response.json();
        setComplaints(data);
      } catch (err) {
        setError("Failed to load complaints. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate, user]); //  Added user to dependency array

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "info";
      case "RESOLVED":
        return "success";
      default:
        return "default";
    }
  };

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedComplaint(null);
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">
          You need to be logged in to view your dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    // <Container maxWidth="lg">
    <>
      <HeaderComponent1 />
      <Box sx={{ my: 4, padding: 10, minHeight: 1000 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            Welcome, {user?.name}!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/citizen/complaint/new")}
          >
            New Complaint
          </Button>
        </Box>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Your Complaints
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : complaints.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" align="center">
                You haven't submitted any complaints yet. Click the "New
                Complaint" button to get started!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {complaints.map((complaint) => (
              <Grid item xs={12} sm={6} md={4} key={complaint.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {complaint.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {complaint.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Chip
                      label={complaint.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={complaint.status.replace(/_/g, " ")}
                      size="small"
                      color={getStatusColor(complaint.status)}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenModal(complaint)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            ))}
          </Grid>
        )}
      </Box>
      <ComplaintDetailsModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        complaint={selectedComplaint}
      />

      <Footer />
    </>
    // </Container>
  );
};

export default CitizenDashboard;
