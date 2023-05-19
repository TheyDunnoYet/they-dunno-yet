import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { login } from "../redux/actions/authActions";
import { clearErrors } from "../redux/actions/errorActions";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";

function Login({ login, clearErrors, error = {} }) {
  let navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    return () => {
      clearErrors(); // Clear errors when the component is unmounted
    };
  }, [clearErrors]);

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(userData)
      .then(() => {
        navigate("/"); // redirect user after login
      })
      .catch((err) => {
        // handle error
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          label="Email"
          required
          error={!!error.email}
          helperText={error.email}
        />
        <TextField
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          label="Password"
          required
          error={!!error.password}
          helperText={error.password}
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => ({
  error: state.error || {},
});

export default connect(mapStateToProps, { login, clearErrors })(Login);
