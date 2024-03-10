import { useState, useEffect } from "react";
import Axios from "axios";
import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import { useContext } from "react";
import { API_URL, RoleContext } from "../../App";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import TransferWithinAStationOutlinedIcon from "@mui/icons-material/TransferWithinAStationOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";

function Profile() {
  const [username, setUsername] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [email, setEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { role, setRole } = useContext(RoleContext);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [error, setError] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    try {
      Axios.get(API_URL + "/getPersonalData/", {
        withCredentials: true,
      }).then(async (response) => {
        if (response.status === 200) {
          setCurrentRole(response.data.role);
          setNewEmail(response.data.email);
          setEmail(response.data.email);
          setNewUsername(response.data.username);
          setUsername(response.data.username);
        } else {
          console.log("Failed to load");
        }
      });
    } catch (error) {
      if (error.response) {
        // Error-response from the Server
        if (error.response.data.error) {
          console.log(error.response.data.error);
        }
      } else if (error.request) {
        console.log("No Response from Server");
      } else {
        console.log("Error:" + error.message);
      }
    }
  }, []);

  const ProfileItem_style = {
    minWidth: "300px",
    borderRadius: "10px",
    padding: "40px",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
    marginBottom: "30px",
  };

  const changeUsername = async (e) => {
    setUsernameError("");
    e.preventDefault();
    setUsernameLoading(true);
    try {
      if (username === newUsername) {
        setUsernameError("The username is the same as before");
      } else {
        await Axios.put(
          API_URL + "/updateUsername/",
          { newUsername },
          { withCredentials: true }
        ).then(async (response) => {
          if (response.status === 200) {
            setUsername(newUsername);
            alert("The username was changed successfully");
          } else {
            setUsernameError("Failed to change username");
          }
        });
      }
    } catch (error) {
      if (error.response) {
        // Error-response from the Server
        if (error.response.data.error) {
          setUsernameError(error.response.data.error);
        }
      } else if (error.request) {
        setUsernameError("No Response from Server");
      } else {
        setUsernameError("Error:" + error.message);
      }
    }
    setUsernameLoading(false);
  };

  const changePassword = async (e) => {
    setPasswordError("");
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await Axios.put(
        API_URL + "/updatePassword/",
        { newPassword },
        { withCredentials: true }
      ).then(async (response) => {
        if (response.status === 200) {
          setNewPassword("");
          alert("The password was changed successfully");
        } else {
          setPasswordError("Failed to change password");
        }
      });
    } catch (error) {
      if (error.response) {
        // Error-response from the Server
        if (error.response.data.error) {
          setPasswordError(error.response.data.error);
        }
      } else if (error.request) {
        setPasswordError("No Response from Server");
      } else {
        setPasswordError("Error:" + error.message);
      }
    }
    setPasswordLoading(false);
  };

  const changeEmail = async (e) => {
    setEmailError("");
    e.preventDefault();
    setEmailLoading(true);
    try {
      if (email === newEmail) {
        setEmailError("The email address is the same as before");
      } else {
        await Axios.put(
          API_URL + "/updateEmail/",
          { newEmail },
          { withCredentials: true }
        ).then(async (response) => {
          if (response.status === 200) {
            setEmail(newEmail);
            alert("The email address was changed successfully");
          } else {
            setEmailError("Failed to change email");
          }
        });
      }
    } catch (error) {
      if (error.response) {
        // Error-response from the Server
        if (error.response.data.error) {
          setEmailError(error.response.data.error);
        }
      } else if (error.request) {
        setEmailError("No Response from Server");
      } else {
        setEmailError("Error:" + error.message);
      }
    }
    setEmailLoading(false);
  };

  const changeRole = (e, newRole) => {
    setRoleError("");
    e.preventDefault();
    if (currentRole === newRole) {
      setRoleError("The role is the same as before");
    } else {
      try {
        Axios.put(
          API_URL + "/update-role/",
          { role: newRole },
          { withCredentials: true }
        ).then(async (response) => {
          if (response.status === 200) {
            setCurrentRole(newRole);
            sessionStorage.setItem("role", newRole);
            setRole(newRole);
          } else {
            setRoleError("Failed to change role");
          }
        });
      } catch (error) {
        if (error.response) {
          // Error-response from the Server
          if (error.response.data.error) {
            setRoleError(error.response.data.error);
          }
        } else if (error.request) {
          setRoleError("No Response from Server");
        } else {
          setRoleError("Error:" + error.message);
        }
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        className="Profile"
        style={{
          paddingRight: "10%",
          paddingLeft: "10%",
          paddingTop: "50px",
        }}
      >
        <Typography variant="h3" align="center" color="primary" pb="50px">
          Your Personal Information!
        </Typography>
        <Grid item xs={6} style={ProfileItem_style}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid
              item
              xs={12}
              sm={3}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h5" align="left">
                <b>Username</b>
              </Typography>
              <BadgeOutlinedIcon
                sx={{
                  fontSize: "2rem",
                  color: "primary",
                  marginTop: "5px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Your Username"
                placeholder="New Username"
                fullWidth
                margin="normal"
                required
                value={newUsername}
                onChange={(event) => setNewUsername(event.target.value)}
                InputProps={{
                  style: {
                    borderRadius: 15,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={changeUsername}
                style={{
                  marginTop: "25px",
                  borderRadius:
                    "theme.components.MuiButton.styleOverrides.root.borderRadius",
                  minWidth: "120px",
                }}
                loading={usernameLoading}
              >
                {usernameLoading ? <CircularProgress /> : "Change"}
              </Button>
            </Grid>
          </Grid>
          <p className="error" style={{ color: theme.palette.error.main }}>
            {usernameError}
          </p>
        </Grid>
        <Grid item xs={6} style={ProfileItem_style}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid
              item
              xs={12}
              sm={3}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="h5"
                align="left"
                style={{ marginTop: "20px" }}
              >
                <b>Password</b>
              </Typography>
              <PasswordOutlinedIcon
                sx={{
                  fontSize: "2rem",
                  color: "primary",
                  marginTop: "5px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="New Password"
                fullWidth
                margin="normal"
                required
                value={newPassword}
                type="password"
                onChange={(event) => setNewPassword(event.target.value)}
                InputProps={{
                  style: {
                    borderRadius: 15,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={changePassword}
                style={{
                  marginTop: "25px",
                  borderRadius:
                    "theme.components.MuiButton.styleOverrides.root.borderRadius",
                  minWidth: "120px",
                }}
                loading={passwordLoading}
              >
                {passwordLoading ? <CircularProgress /> : "Change"}
              </Button>
            </Grid>
          </Grid>
          <p className="error" style={{ color: theme.palette.error.main }}>
            {passwordError}
          </p>
        </Grid>
        <Grid item xs={6} style={ProfileItem_style}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid
              item
              xs={12}
              sm={3}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="h5"
                align="left"
                style={{ marginTop: "20px" }}
              >
                <b>Email address</b>
              </Typography>
              <EmailOutlinedIcon
                sx={{
                  fontSize: "2rem",
                  color: "primary",
                  marginTop: "5px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Your Email address"
                placeholder="New Email address"
                fullWidth
                margin="normal"
                required
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                InputProps={{
                  style: {
                    borderRadius: 15,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={changeEmail}
                style={{
                  marginTop: "25px",
                  borderRadius:
                    "theme.components.MuiButton.styleOverrides.root.borderRadius",
                  minWidth: "120px",
                }}
                loading={emailLoading}
              >
                {emailLoading ? <CircularProgress /> : "Change"}
              </Button>
            </Grid>
          </Grid>
          <p className="error" style={{ color: theme.palette.error.main }}>
            {emailError}
          </p>
        </Grid>
        <Box mb={15}>
          <Grid item xs={6} style={ProfileItem_style}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid
                item
                xs={12}
                sm={3}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="h5"
                  align="left"
                  style={{ marginTop: "20px" }}
                >
                  <b>Role</b>
                </Typography>
                <TransferWithinAStationOutlinedIcon
                  sx={{
                    fontSize: "2rem",
                    color: "primary",
                    marginTop: "5px",
                  }}
                />
              </Grid>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <Card
                  sx={{
                    flex: 1,
                    marginRight: 10,
                    padding: 2,
                    border:
                      role === "explorer"
                        ? `4px solid ${theme.palette.primary.main}`
                        : `2px solid ${theme.palette.secondary.main}`,
                    borderRadius: theme.shape.borderRadius,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    <Grid container justifyContent="space-between" mr="50px">
                      <Typography
                        component="div"
                        sx={{
                          fontSize: "30px",
                          mb: 3,
                          color:
                            role === "explorer" && theme.palette.primary.main,
                          textAlign: "left",
                        }}
                      >
                        <b>Explorer</b>
                        <Typography
                          color="text.secondary"
                          sx={{ textAlign: "left" }}
                        >
                          New to the field
                        </Typography>
                      </Typography>
                      <ExploreOutlinedIcon
                        sx={{
                          fontSize: "3rem",
                          color:
                            role === "explorer"
                              ? theme.palette.primary.main
                              : "primary",
                        }}
                      />
                    </Grid>

                    <Typography variant="body1" sx={{ textAlign: "left" }}>
                      You want to try out and build trust in the latest models
                      in the NLP field. You also want to see simple
                      explanations.
                    </Typography>
                  </CardContent>

                  <CardActions
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => changeRole(e, "explorer")}
                      style={{
                        minWidth: 180,

                        borderRadius:
                          theme.components.MuiButton.styleOverrides.root
                            .borderRadius,
                      }}
                      loading={loading1}
                      disabled={currentRole === "explorer"}
                    >
                      {loading1 ? <CircularProgress /> : "Select Explorer"}
                    </Button>
                  </CardActions>
                </Card>
                <Card
                  sx={{
                    flex: 1,
                    padding: 2,
                    border:
                      role === "analyst"
                        ? `4px solid ${theme.palette.primary.main}`
                        : `2px solid ${theme.palette.secondary.main}`,
                    borderRadius: theme.shape.borderRadius,
                    marginRight: 10,
                  }}
                >
                  <CardContent>
                    <Grid container justifyContent="space-between" mr="50px">
                      <Typography
                        sx={{
                          fontSize: "30px",
                          mb: 3,
                          color:
                            role === "analyst" && theme.palette.primary.main,
                          textAlign: "left",
                        }}
                      >
                        <b>Analyst</b>
                        <Typography
                          color="text.secondary"
                          sx={{ textAlign: "left" }}
                        >
                          Expert in the field of NLP
                        </Typography>
                      </Typography>
                      <TroubleshootIcon
                        sx={{
                          fontSize: "3rem",
                          color:
                            role === "analyst"
                              ? theme.palette.primary.main
                              : "primary",
                        }}
                      />
                    </Grid>
                    <Typography variant="body1" sx={{ textAlign: "left" }}>
                      You already have some knowledge in the field of NLP. You
                      expect different explanation methods.
                    </Typography>
                  </CardContent>

                  <CardActions
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => changeRole(e, "analyst")}
                      style={{
                        minWidth: 180,
                        borderRadius:
                          theme.components.MuiButton.styleOverrides.root
                            .borderRadius,
                      }}
                      loading={loading2}
                      disabled={currentRole === "analyst"}
                    >
                      {loading2 ? <CircularProgress /> : "Select Analyst"}
                    </Button>
                  </CardActions>
                </Card>
              </div>
            </Grid>
            {error && (
              <p className="error" style={{ color: theme.palette.error.main }}>
                {roleError}
              </p>
            )}
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
}
export default Profile;
