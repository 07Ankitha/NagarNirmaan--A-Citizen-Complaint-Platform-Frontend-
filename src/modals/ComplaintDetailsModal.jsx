import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
} from "@mui/material";

const ComplaintDetailsModal = ({ open, handleClose, complaint }) => {
  if (!complaint) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px" }}>
        {complaint.title}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Description
            </Typography>
            <Typography variant="body1" gutterBottom>
              {complaint.description}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Category
            </Typography>
            <Typography variant="body1">{complaint.category}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Typography variant="body1">{complaint.status}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Raised By
            </Typography>
            <Typography variant="body1">{complaint.name}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1">{complaint.email}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Address
            </Typography>
            <Typography variant="body1">{complaint.address}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Date Created
            </Typography>
            <Typography variant="body2">
              {new Date(complaint.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          {complaint.imageUrl && (
            <Grid item xs={12}>
              <Box
                component="img"
                src={`https://nagarnirmaan-backend.onrender.com/${complaint.imageUrl.replace(
                  /\\/g,
                  "/"
                )}`}
                alt="Complaint"
                sx={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  borderRadius: 2,
                  mt: 2,
                  border: "1px solid #ccc",
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComplaintDetailsModal;
