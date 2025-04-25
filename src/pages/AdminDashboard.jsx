import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/Footer";
import AdminHeaderComponent from "../components/AdminHeaderComponent";
import { useNavigate } from "react-router-dom";
import AssignWorkModal from "../modals/AssignWorkModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewAssignmentModal from "../modals/ViewAssignmentModal";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [filters, setFilters] = useState({
    status: "ALL",
    category: "ALL",
    city: "ALL", // Add city to the filters
  });
  const navigate = useNavigate();
  const [assignedComplaintIds, setAssignedComplaintIds] = useState([]);
  const [viewAssignmentModalOpen, setViewAssignmentModalOpen] = useState(false); // State for the view modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          "https://nagarnirmaan-backend.onrender.com/api/admin/complaints",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const data = await response.json();
        console.log("Fetched Complaints Data:", data); // Keep this log
        setComplaints(data);
        const assignedIds = data
          .filter((complaint) => complaint.assigned)
          .map((c) => c.id);
        setAssignedComplaintIds(assignedIds);
      } catch (err) {
        setError("Failed to load complaints. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const isComplaintAssigned = (complaintId) => {
    const isAssigned = assignedComplaintIds.includes(complaintId);
    console.log(`Complaint ID ${complaintId} isAssigned:`, isAssigned); // Keep this log
    return isAssigned;
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (assignModalOpen && selectedComplaint) {
        // Fetch only when the modal is open and a complaint is selected
        try {
          const response = await fetch(
            `https://nagarnirmaan-backend.onrender.com/api/organizations?city=${selectedComplaint.city}&category=${selectedComplaint.category}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch organizations");
          }

          const data = await response.json();
          setOrganizations(data);
        } catch (err) {
          setError("Failed to load organizations. Please try again later.");
        }
      } else {
        setOrganizations([]); // Clear organizations if the modal is closed or no complaint is selected
      }
    };

    fetchOrganizations();
  }, [assignModalOpen, selectedComplaint]); // Re-fetch when the modal opens or the selected complaint changes

  const handleStatusUpdate = async (complaintId, newStatus, remarks) => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const adminId = loggedInUser?.id;

      const response = await fetch(
        `https://nagarnirmaan-backend.onrender.com/api/admin/complaints/${complaintId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            remarks: remarks,
            adminId: adminId, // sending the logged-in admin's id
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Handle success message

        setComplaints(
          complaints.map((complaint) =>
            complaint.id === complaintId
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
        setUpdateDialogOpen(false);
        setSelectedComplaint(null);
      } else {
        const errorText = await response.json();
        throw new Error(errorText.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleAssignWork = async (assignmentData) => {
    try {
      const response = await fetch("https://nagarnirmaan-backend.onrender.com/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          complaintId: selectedComplaint.id,
          organizationId: assignmentData.organization,
          startDate: assignmentData.startDate,
          endDate: assignmentData.endDate,
        }),
      });

      if (response.ok) {
        console.log("Work assigned successfully!");
        setAssignModalOpen(false);
        setAssignedComplaintIds([
          ...assignedComplaintIds,
          selectedComplaint.id,
        ]); // Update assigned IDs
        setSelectedComplaint(null);
        // Optionally, you might want to refresh the complaints list
      } else {
        console.error("Failed to assign work:", response.status);
        alert("Failed to assign work. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning work:", error);
      alert("Error assigning work. Please try again.");
    }
  };

  const handleOpenAssignModal = (complaint) => {
    setSelectedComplaint(complaint);
    setAssignModalOpen(true);
  };

  const handleOpenViewAssignmentModal = async (complaintId) => {
    try {
      const response = await fetch(
        `https://nagarnirmaan-backend.onrender.com/api/assignments/complaint/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedAssignment(data);
        setViewAssignmentModalOpen(true);
      } else {
        console.error("Failed to fetch assignment details:", response.status);
        alert("Failed to fetch assignment details.");
      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      alert("Error fetching assignment details.");
    }
  };

  const handleCloseViewAssignmentModal = () => {
    setViewAssignmentModalOpen(false);
    setSelectedAssignment(null);
  };

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

  // const isComplaintAssigned = (complaintId) => {
  //   return assignedComplaintIds.includes(complaintId);
  // };

  const filteredComplaints = complaints.filter((complaint) => {
    if (filters.status !== "ALL" && complaint.status !== filters.status) {
      return false;
    }
    if (filters.category !== "ALL" && complaint.category !== filters.category) {
      return false;
    }
    return true;
  });

  return (
    // <Container maxWidth="lg">
    <>
      <AdminHeaderComponent />
      <Box sx={{ my: 4, padding: 5, minHeight: 1000 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                label="Status"
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                label="Category"
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                <MenuItem value="ROAD_ISSUES">Road Issues</MenuItem>
                <MenuItem value="WASTE_MANAGEMENT">Waste Management</MenuItem>
                <MenuItem value="WATER_SUPPLY">Water Supply</MenuItem>
                <MenuItem value="ELECTRICITY">Electricity</MenuItem>
                <MenuItem value="PUBLIC_SAFETY">Public Safety</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Assign Task</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <Link
                        to={`/complaints/${complaint.id}`}
                        style={{
                          color: "#3f51b5",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        {complaint.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {complaint.category.replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status.replace("_", " ")}
                        color={getStatusColor(complaint.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {complaint.name}
                      <Typography variant="caption" display="block">
                        {complaint.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Update Status">
                        <IconButton
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setUpdateDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {complaint.status === "PENDING" ? (
                        isComplaintAssigned(complaint.id) ? (
                          <Tooltip title="View Assignment">
                            <IconButton
                              onClick={() =>
                                handleOpenViewAssignmentModal(complaint.id)
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Button
                            onClick={() => handleOpenAssignModal(complaint)}
                          >
                            Assign
                          </Button>
                        )
                      ) : (
                        <Tooltip title="View Assignment">
                          <IconButton
                            onClick={() =>
                              handleOpenViewAssignmentModal(complaint.id)
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog
          open={updateDialogOpen}
          onClose={() => {
            setUpdateDialogOpen(false);
            setSelectedComplaint(null);
          }}
        >
          <DialogTitle>Update Complaint Status</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>New Status</InputLabel>
                <Select
                  value={selectedComplaint?.status || ""}
                  onChange={(e) => {
                    if (selectedComplaint) {
                      setSelectedComplaint({
                        ...selectedComplaint,
                        status: e.target.value,
                      });
                    }
                  }}
                  label="New Status"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Remarks"
                placeholder="Enter remarks about the status update..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setUpdateDialogOpen(false);
                setSelectedComplaint(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedComplaint) {
                  handleStatusUpdate(
                    selectedComplaint.id,
                    selectedComplaint.status,
                    remarks
                  );
                }
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {assignModalOpen && selectedComplaint && (
        <AssignWorkModal
          show={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onAssign={handleAssignWork}
          category={selectedComplaint.category}
          city={selectedComplaint.city}
          organizations={organizations}
        />
      )}

      {viewAssignmentModalOpen && selectedAssignment && (
        <ViewAssignmentModal
          show={viewAssignmentModalOpen}
          onClose={handleCloseViewAssignmentModal}
          assignment={selectedAssignment}
        />
      )}

      <Footer />
    </>

    // </Container>
  );
};

export default AdminDashboard;
