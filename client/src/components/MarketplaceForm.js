import React, { useState } from "react";
import { createMarketplace } from "../redux/actions/marketplaceActions";
import { connect } from "react-redux";
import {
  Button,
  TextField,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function MarketplaceForm({ user, blockchains, createMarketplace }) {
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.role === "Admin" && blockchain !== "") {
      try {
        await createMarketplace({ name, acronym, blockchain });
        setOpen(true); // Open Snackbar
        setName("");
        setAcronym("");
        setBlockchain("");
      } catch (error) {
        console.error(error);
      }
    } else if (blockchain === "") {
      console.error("No blockchain selected");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
                fullWidth
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Blockchain</InputLabel>
                <Select
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select a blockchain...</em>
                  </MenuItem>
                  {blockchains.map((blockchain) => (
                    <MenuItem key={blockchain._id} value={blockchain._id}>
                      {blockchain.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" type="submit">
                Create Marketplace
              </Button>
            </form>
          </Paper>
        </Grid>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            The Marketplace has been successfully created!
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
  blockchains: state.blockchain.blockchains,
});

export default connect(mapStateToProps, { createMarketplace })(MarketplaceForm);
