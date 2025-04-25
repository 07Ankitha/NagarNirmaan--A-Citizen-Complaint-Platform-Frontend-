import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentIcon from "@mui/icons-material/Comment";
import axios from "axios";
import moment from "moment";
import HeaderComponent1 from "../components/HeaderComponent1";
import Footer from "../components/Footer";

const CitizenNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openRemarksDialog, setOpenRemarksDialog] = useState(false);
  const [selectedRemarks, setSelectedRemarks] = useState("");
  const [feedbackMap, setFeedbackMap] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    axios
      .get("https://nagarnirmaan-backend.onrender.com/api/notifications")
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  const handleOpenRemarksDialog = (remarks) => {
    setSelectedRemarks(remarks);
    setOpenRemarksDialog(true);
  };

  const handleCloseRemarksDialog = () => {
    setOpenRemarksDialog(false);
  };

  const handleSubmitFeedback = async (id) => {
    const feedback = feedbackMap[id];
    if (!feedback || !feedback.rating) {
      setSnackbar({
        open: true,
        message: "Please provide a rating before submitting.",
        severity: "error",
      });
      return;
    }

    const payload = {
      complaintId: id,
      rating: feedback.rating,
      feedbackText: feedback.text || "",
    };

    try {
      // Submit feedback to the backend
      await axios.post("https://nagarnirmaan-backend.onrender.com/api/feedback", payload);

      // Update the feedbackMap with the submitted feedback
      setFeedbackMap({
        ...feedbackMap,
        [id]: { ...feedback, isSubmitted: true }, // Add 'isSubmitted' flag to disable input
      });

      setSnackbar({
        open: true,
        message: `Thank you! Feedback submitted for Complaint #${id}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSnackbar({
        open: true,
        message: "Error submitting feedback. Please try again later.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredNotifications = (
    statusFilter === "ALL"
      ? notifications
      : notifications.filter((n) => n.status.toUpperCase() === statusFilter)
  ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <HeaderComponent1 />
      <Box sx={{ p: 4, backgroundColor: "#e3f2fd", minHeight: "100vh" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ color: "#0d47a1", fontWeight: "bold", mb: 2 }}
        >
          <NotificationsIcon sx={{ mr: 1, fontSize: "2.5rem" }} />
          Notifications
        </Typography>

        <FormControl
          sx={{
            mb: 3,
            minWidth: 250,
            "& .MuiInputBase-root": {
              fontSize: "1.1rem",
            },
            "& .MuiInputLabel-root": {
              fontSize: "1.1rem",
            },
          }}
        >
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
          </Select>
        </FormControl>

        {filteredNotifications.map((notification) => (
          <Paper
            key={notification.id}
            elevation={3}
            sx={{
              p: 3,
              my: 2,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              borderLeft: "6px solid #1565c0",
              maxWidth: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Complaint #{notification.complaintId}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontStyle: "italic", color: "#0d47a1" }}
                >
                  {notification.complaintTitle}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  label={notification.status}
                  color={
                    notification.status === "RESOLVED"
                      ? "success"
                      : notification.status === "IN_PROGRESS"
                      ? "warning"
                      : "default"
                  }
                  sx={{ fontWeight: "bold" }}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {moment(notification.updatedAt).format(
                      "DD MMM YYYY, hh:mm A"
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AssignmentIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {notification.updatedBy}
                  </Typography>
                </Box>

                <Tooltip title="View Remarks">
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleOpenRemarksDialog(notification.remarks)
                    }
                  >
                    <CommentIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Feedback Section for RESOLVED complaints */}
            {notification.status === "RESOLVED" && (
              <Box
                sx={{
                  mt: 1,
                  backgroundColor: "#f1f8e9",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #c5e1a5",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  We’d love to hear your feedback!
                </Typography>

                {/* If feedback is already submitted, show it and disable input */}
                {feedbackMap[notification.id]?.isSubmitted ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Your Rating:
                    </Typography>
                    <Rating
                      name={`rating-${notification.id}`}
                      value={feedbackMap[notification.id]?.rating || 0}
                      readOnly
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {feedbackMap[notification.id]?.text}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography sx={{ mr: 2 }}>Rate our response:</Typography>
                    <Rating
                      name={`rating-${notification.id}`}
                      value={feedbackMap[notification.id]?.rating || 0}
                      onChange={(event, newValue) =>
                        setFeedbackMap({
                          ...feedbackMap,
                          [notification.id]: {
                            ...(feedbackMap[notification.id] || {}),
                            rating: newValue,
                          },
                        })
                      }
                    />
                  </Box>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Optional feedback..."
                  value={feedbackMap[notification.id]?.text || ""}
                  onChange={(e) =>
                    setFeedbackMap({
                      ...feedbackMap,
                      [notification.id]: {
                        ...(feedbackMap[notification.id] || {}),
                        text: e.target.value,
                      },
                    })
                  }
                  disabled={feedbackMap[notification.id]?.isSubmitted} // Disable if feedback is already submitted
                />

                {!feedbackMap[notification.id]?.isSubmitted && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmitFeedback(notification.id)}
                    >
                      Submit Feedback
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        ))}

        <Dialog open={openRemarksDialog} onClose={handleCloseRemarksDialog}>
          <DialogTitle>Remarks</DialogTitle>
          <DialogContent>
            <Typography>{selectedRemarks}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRemarksDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer />
    </>
  );
};

export default CitizenNotificationPage;
