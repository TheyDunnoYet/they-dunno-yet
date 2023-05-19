import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { logout } from "../redux/actions/authActions";

const NavBar = ({ auth: { isAuthenticated }, logout }) => {
  const authLinks = (
    <Button color="inherit" onClick={logout}>
      Logout
    </Button>
  );

  const guestLinks = (
    <>
      <Button color="inherit">
        <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
          Login
        </Link>
      </Button>
      <Button color="inherit">
        <Link to="/register" style={{ textDecoration: "none", color: "white" }}>
          Sign Up
        </Link>
      </Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            They Dunno Yet
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/products">
          Products
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        {isAuthenticated ? authLinks : guestLinks}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(NavBar);
