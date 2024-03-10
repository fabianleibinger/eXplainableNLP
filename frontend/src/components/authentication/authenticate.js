import { useState } from "react";
import Axios from "axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext, RoleContext, StaffContext } from "../../App";
import { API_URL } from "../../App";

function Authentication() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { logedIn, setLogin } = useContext(LoginContext);
  const { role, setRole } = useContext(RoleContext);
  const { staff, setStaff } = useContext(StaffContext);
  const [loading, setLoading] = useState(false);
  const [isHovered, setHovered] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Axios.post(
        API_URL + "/login/",
        { username, password },
        { withCredentials: true }
      ).then(async (response) => {
        if (response.status === 200) {
          sessionStorage.setItem("firstname", response.data.firstname);
          setLogin(true);
          setRole(response.data.role);
          setStaff(response.data.staff);
          sessionStorage.setItem("logedIn", "true");
          sessionStorage.setItem("role", response.data.role);
          sessionStorage.setItem("staff", response.data.staff);
          navigate("/");
          if (response.data.staff === true) {
            alert("You are logged in as an admin");
          }
        } else {
          setError("Failed to log in");
        }
      });
    } catch (error) {
      if (error.response) {
        // Error-response from the Server
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
        className="LoginForm"
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
            <b>Login</b>
          </Typography>
          <TextField
            label="Username"
            placeholder="User123"
            fullWidth
            margin="normal"
            required
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            label="Password"
            placeholder="Your password"
            fullWidth
            margin="normal"
            type="password"
            required
            onChange={(event) => setPassword(event.target.value)}
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
              onClick={loginUser}
              style={{
                marginTop: "30px",
                borderRadius:
                  theme.components.MuiButton.styleOverrides.root.borderRadius,
                minWidth: "200px",
              }}
              loading={loading}
            >
              {loading ? <CircularProgress /> : "Sign in"}
            </Button>

            <p className="signup" style={{ marginTop: "20px" }}>
              <i>You don't have an account? - </i>
              <Link
                to="/register"
                style={{
                  color: isHovered ? theme.palette.primary.main : "#1d5794",
                  textDecoration: isHovered ? "underline" : "none",
                  fontWeight: 900,
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                Register now
              </Link>
            </p>
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  );
}
export default Authentication;
