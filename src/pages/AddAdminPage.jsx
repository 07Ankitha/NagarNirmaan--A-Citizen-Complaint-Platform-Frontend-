import React, { useState } from "react";
import axios from "axios";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Footer from "../components/Footer";
import AdminHeaderComponent from "../components/AdminHeaderComponent";

const AddAdminPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email domain
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nagarnirmaan\.com$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Email must be in the form of name@nagarnirmaan.com" });
      return;
    }

    // Get token and user info from localStorage
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserEmail = user?.email;

    try {
      const response = await axios.post(
        "https://nagarnirmaan-backend.onrender.com/api/admin/users/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Logged-In-User": currentUserEmail,
          },
        }
      );
      setMessage({ type: "success", text: response.data.message });
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Failed to create admin user.";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  return (
    <>
    <AdminHeaderComponent />
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.avatar}>
          <AdminPanelSettingsIcon fontSize="large" />
        </div>
        <h2 style={styles.header}>Add New Admin</h2>
        {message.text && (
          <div style={message.type === "error" ? styles.alertError : styles.alertSuccess}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            Create Admin
          </button>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#e0f7fa", // Light blue background
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    border: "1px solid #b3e5fc", // Light blue border
  },
  avatar: {
    marginBottom: "20px",
    backgroundColor: "#80deea", // Light teal blue
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    fontSize: "26px",
    color: "#0288d1", // Blue color
    marginBottom: "20px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    width: "100%",
    padding: "14px",
    margin: "8px 0",
    border: "1px solid #b3e5fc", // Light blue border
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    transition: "0.3s",
  },
  inputFocus: {
    borderColor: "#0288d1", // Blue color on focus
  },
  submitButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#0288d1", // Blue color
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "20px",
  },
  submitButtonHover: {
    backgroundColor: "#0277bd", // Slightly darker blue for hover effect
  },
  alertSuccess: {
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#c8e6c9", // Light green background for success
    color: "#388e3c", // Green color text
    borderRadius: "8px",
    fontSize: "14px",
  },
  alertError: {
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#f8d7da", // Light red background for error
    color: "#d32f2f", // Red color text
    borderRadius: "8px",
    fontSize: "14px",
  },
};

export default AddAdminPage;
