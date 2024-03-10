import React, { useState } from "react";
import Axios from "axios";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext, RoleContext, StaffContext } from "../../App";
import { API_URL } from "../../App";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState("explorer");
  const { logedIn, setLogin } = useContext(LoginContext);
  const { role, setRole } = useContext(RoleContext);
  const { staff, setStaff } = useContext(StaffContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post(
        API_URL + "/register/",
        {
          firstname,
          lastname,
          email,
          username,
          password,
          role: selectedRole,
        },
        { withCredentials: true }
      );
      if (response.status === 201) {
        sessionStorage.setItem("firstname", response.data.firstname);
        setLogin(true);
        sessionStorage.setItem("logedIn", "true");
        sessionStorage.setItem("role", selectedRole);
        navigate("/role");
      } else {
        setError("Failed to register");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.error) {
          setError(error.response.data.error);
        }
      } else if (error.request) {
        setError("No Response from Server");
      } else {
        setError("Error:" + error.message);
      }
    }
    setLoading(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <div
        className="Register Form"
        style={{
          paddingRight: "20%",
          paddingLeft: "20%",
          paddingTop: "100px",
        }}
      >
        <Paper
          elevation={10}
          style={{
            paddingRight: "60px",
            paddingLeft: "60px",
            paddingTop: "40px",
            paddingBottom: "20px",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          <Typography variant="h3" align="center" color="primary">
            Welcome to XLNP!
          </Typography>
          <Typography variant="h5" align="center" style={{ marginTop: "20px" }}>
            <b>Register here!</b>
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <TextField
              label="Firstname"
              placeholder="John"
              required
              onChange={(event) => setFirstname(event.target.value)}
              style={{ flex: 1, marginRight: "10px" }}
            />
            <TextField
              label="Lastname"
              placeholder="Public"
              required
              onChange={(event) => setLastname(event.target.value)}
              style={{ flex: 1, marginLeft: "10px" }}
            />
          </div>
          <TextField
            label="Email"
            placeholder="john@mail.de"
            required
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            style={{ marginTop: "20px" }}
          />
          <TextField
            label="Username"
            placeholder="user123"
            required
            onChange={(event) => setUsername(event.target.value)}
            fullWidth
            style={{ marginTop: "20px" }}
          />
          <TextField
            label="Password"
            placeholder="Your password"
            type="password"
            required
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            style={{ marginTop: "20px" }}
          />

          {error && (
            <p className="error" style={{ color: theme.palette.error.main }}>
              {error}
            </p>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={registerUser}
              style={{
                marginTop: "20px",
                borderRadius:
                  theme.components.MuiButton.styleOverrides.root.borderRadius,
                minWidth: "200px",
              }}
              loading={loading}
            >
              {loading ? <CircularProgress /> : "Register"}
            </Button>
            <p className="login" style={{ marginTop: "20px" }}>
              <Typography>
                <i>Already have an account? - </i>
                <Link
                  to="/auth"
                  style={{
                    color: isHovered ? theme.palette.primary.main : "#1d5794",
                    textDecoration: isHovered ? "underline" : "none",
                    fontWeight: 900,
                  }}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  Login{" "}
                </Link>
              </Typography>
            </p>
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  );
}
export default Register;
