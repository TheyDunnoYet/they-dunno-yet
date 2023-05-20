import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { login } from "../redux/actions/authActions";
import { clearErrors } from "../redux/actions/errorActions";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Box,
  Snackbar,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Visibility, VisibilityOff } from "@material-ui/icons";

function Login({ login, clearErrors, error = {}, isAuthenticated }) {
  let navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [localErrors, setLocalErrors] = useState({
    email: "",
    password: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // For Snackbar
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stayLogged, setStayLogged] = useState(false);

  useEffect(() => {
    if (error && error.id === "LOGIN_FAIL") {
      setFormErrors({
        email: error.msg.email,
        password: error.msg.password,
      });
      clearErrors();
    }
  }, [error, clearErrors]);

  useEffect(() => {
    let timeoutId;

    if (isAuthenticated) {
      setSnackbarOpen(true);
      timeoutId = setTimeout(() => {
        navigate("/");
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, navigate]);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setUserData({ ...userData, email: newEmail });

    const isValidEmail = (email) => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };

    if (!newEmail.trim() || !isValidEmail(newEmail)) {
      setLocalErrors((errors) => ({
        ...errors,
        email: "Please enter a valid email.",
      }));
    } else {
      setLocalErrors((errors) => ({
        ...errors,
        email: "",
      }));
    }
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setUserData({ ...userData, password: newPassword });

    if (!newPassword.trim()) {
      setLocalErrors((errors) => ({
        ...errors,
        password: "Please enter a password.",
      }));
    } else {
      setLocalErrors((errors) => ({
        ...errors,
        password: "",
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (localErrors.email || localErrors.password) {
      return;
    }

    // Attempt to login
    login(userData, stayLogged).catch((err) => {
      // Pass stayLogged to login
      if (err.response && err.response.status === 400) {
        setErrorSnackbarOpen(true); // Open the error Snackbar
        setFormErrors({
          ...formErrors,
          email:
            err.response.data.msg === "Invalid email"
              ? "Invalid email. Please try again."
              : "",
          password:
            err.response.data.msg === "Invalid password"
              ? "Invalid password. Please try again."
              : "",
        });
      }
    });
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box my={5}>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            autoFocus
            type="email"
            name="email"
            value={userData.email}
            onChange={handleEmailChange}
            label="Email"
            error={!!(formErrors.email || localErrors.email)}
            helperText={formErrors.email || localErrors.email}
            fullWidth
          />
          <TextField
            type={showPassword ? "text" : "password"}
            name="password"
            value={userData.password}
            onChange={handlePasswordChange}
            label="Password"
            error={!!(formErrors.password || localErrors.password)}
            helperText={formErrors.password || localErrors.password}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={stayLogged}
                onChange={(e) => setStayLogged(e.target.checked)}
                name="stayLogged"
                color="primary"
              />
            }
            label="Keep me logged in"
          />
          <Button type="submit" color="primary" variant="contained" fullWidth>
            Login
          </Button>
        </form>
        <Snackbar
          open={errorSnackbarOpen}
          autoHideDuration={5000}
          onClose={() => setErrorSnackbarOpen(false)}
        >
          <Alert onClose={() => setErrorSnackbarOpen(false)} severity="error">
            This user doesn't exist. Please try again.
          </Alert>
        </Snackbar>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            elevation={6}
          >
            Login successful!
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

export default connect(mapStateToProps, { login, clearErrors })(Login);
