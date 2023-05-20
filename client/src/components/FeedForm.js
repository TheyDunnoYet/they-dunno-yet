import React, { useState } from "react";
import { createFeed } from "../api/feed";
import { connect } from "react-redux";
import { Button, TextField, Grid, Paper, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert"; // Import Alert component

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function FeedForm({ user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // Add state for Snackbar

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.role === "Admin") {
      try {
        await createFeed({ name, description });
        setName("");
        setDescription("");
        setOpenSnackbar(true); // Open Snackbar on successful feed creation
      } catch (error) {
        console.error("Error:", error);
        console.error("Error Details:", error.response.data);
      }
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  if (user && user.role === "Admin") {
    return (
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={4}
                margin="normal"
              />
              <Button variant="contained" color="primary" type="submit">
                Create Feed
              </Button>
            </form>
          </Paper>
        </Grid>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            The Feed has been successfully created!
          </Alert>
        </Snackbar>
      </Grid>
    );
  } else {
    return null;
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(FeedForm);
