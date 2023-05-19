import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { register } from "../redux/actions/authActions";
import { clearErrors } from "../redux/actions/errorActions";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Box, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function Register({ register, clearErrors, error, isAuthenticated }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [localErrors, setLocalErrors] = useState({
    // Store local validation errors
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // For Snackbar

  useEffect(() => {
    if (error && error.id === "REGISTER_FAIL") {
      setFormErrors({
        name: error.msg.name,
        email: error.msg.email,
        password: error.msg.password,
      });
    } else {
      setFormErrors({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset local errors at the start of form submission
    setLocalErrors({
      name: "",
      email: "",
      password: "",
      password2: "",
    });

    // Check if fields are empty
    if (!userData.name.trim()) {
      setLocalErrors((errors) => ({
        ...errors,
        name: "Please enter a valid name.",
      }));
      return;
    }

    if (!userData.email.trim()) {
      setLocalErrors((errors) => ({
        ...errors,
        email: "Please enter a valid email.",
      }));
      return;
    }

    if (!userData.password.trim()) {
      setLocalErrors((errors) => ({
        ...errors,
        password: "Please enter a password.",
      }));
      return;
    }

    if (!userData.password2.trim()) {
      setLocalErrors((errors) => ({
        ...errors,
        password2: "Please confirm your password.",
      }));
      return;
    }

    // Check password and password2 match
    if (userData.password !== userData.password2) {
      setLocalErrors((errors) => ({
        ...errors,
        password2: "Passwords do not match.",
      }));
      return;
    }

    // Attempt to register
    register(userData);
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box my={5}>
        <h1 style={{ textAlign: "center" }}>Register</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            label="Name"
            error={!!(formErrors.name || localErrors.name)}
            helperText={formErrors.name || localErrors.name}
            fullWidth
          />
          <TextField
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            label="Email"
            error={!!(formErrors.email || localErrors.email)}
            helperText={formErrors.email || localErrors.email}
            fullWidth
          />
          <TextField
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            label="Password"
            error={!!(formErrors.password || localErrors.password)}
            helperText={formErrors.password || localErrors.password}
            fullWidth
          />
          <TextField
            type="password"
            name="password2"
            value={userData.password2}
            onChange={handleChange}
            label="Confirm Password"
            error={!!(formErrors.password2 || localErrors.password2)}
            helperText={formErrors.password2 || localErrors.password2}
            fullWidth
          />
          <Button type="submit" color="primary" variant="contained" fullWidth>
            Register
          </Button>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            elevation={6}
            variant="filled"
          >
            Your registration is complete!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  error: state.error,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register, clearErrors })(Register);
