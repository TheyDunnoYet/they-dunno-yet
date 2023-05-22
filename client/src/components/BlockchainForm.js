import React, { useState } from "react";
import { createBlockchain } from "../api/blockchain";
import { connect } from "react-redux";
import { Button, TextField, Grid, Paper, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function BlockchainForm({ user }) {
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // Add state for Snackbar

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.role === "Admin") {
      try {
        await createBlockchain({ name, acronym });
        setName("");
        setAcronym("");
        setOpenSnackbar(true); // Open Snackbar on successful blockchain creation
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
                label="Acronym"
                value={acronym}
                onChange={(e) => setAcronym(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" type="submit">
                Create Blockchain
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
            The Blockchain has been successfully created!
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

export default connect(mapStateToProps)(BlockchainForm);
