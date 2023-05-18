import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            They Dunno Yet
          </Link>
        </Typography>
        <Button color="inherit">
          <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
            Login
          </Link>
        </Button>
        <Button color="inherit">
          <Link to="/signup" style={{ textDecoration: "none", color: "white" }}>
            Sign Up
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
