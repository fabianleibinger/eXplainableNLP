import React, { useState } from "react";
import Axios from "axios";
import {
  Divider,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext, RoleContext, StaffContext } from "../../App";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import { API_URL } from "../../App";

function Role() {
  const [error, setError] = useState("");
  const { role, setRole } = useContext(RoleContext);
  const { staff, setStaff } = useContext(StaffContext);
  const navigate = useNavigate();
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const { logedIn, setLogin } = useContext(LoginContext);

  const updateRole = async (e, roleChoice) => {
    e.preventDefault();
    if (roleChoice === "analyst") {
      setLoading2(true);
    } else {
      setLoading1(true);
    }
    try {
      await Axios.put(
        API_URL + "/update-role/",
        { role: roleChoice },
        { withCredentials: true }
      ).then(async (response) => {
        if (response.status === 200) {
          sessionStorage.setItem("role", roleChoice);
          setRole(roleChoice);
          setStaff(false);
          navigate("/expectations");
        } else {
          setError("Failed to set role");
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
    setLoading1(false);
    setLoading2(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="RoleForm">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8}>
            <Paper
              elevation={10}
              style={{
                padding: "50px",
                marginTop: "70px",
              }}
            >
              <Typography variant="h4" align="center" color="primary" mb="50px">
                What type of XNLP user are you?
              </Typography>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Card
                  sx={{
                    flex: 1,
                    marginRight: 5,
                    padding: 2,
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: theme.shape.borderRadius,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    <Grid container justifyContent="space-between" mr="50px">
                      <Typography
                        component="div"
                        sx={{ fontSize: "40px", mb: 3, textAlign: "left" }}
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
                          fontSize: "5rem",
                          color: "primary",
                        }}
                      />
                    </Grid>

                    <Typography
                      variant="body1"
                      sx={{ mb: 2, textAlign: "left" }}
                    >
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
                      onClick={(e) => updateRole(e, "explorer")}
                      style={{
                        minWidth: 180,
                        marginBottom: "10px",
                        borderRadius:
                          theme.components.MuiButton.styleOverrides.root
                            .borderRadius,
                      }}
                      loading={loading1}
                    >
                      {loading1 ? <CircularProgress /> : "Select Explorer"}
                    </Button>
                  </CardActions>
                </Card>
                <Card
                  sx={{
                    flex: 1,
                    padding: 2,
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <CardContent>
                    <Grid container justifyContent="space-between" mr="50px">
                      <Typography
                        component="div"
                        sx={{ fontSize: "40px", mb: 3, textAlign: "left" }}
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
                          fontSize: "5rem",
                          color: "primary",
                        }}
                      />
                    </Grid>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, textAlign: "left" }}
                    >
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
                      onClick={(e) => updateRole(e, "analyst")}
                      style={{
                        marginTop: "0px",
                        minWidth: 180,
                        marginBottom: "10px",
                        borderRadius:
                          theme.components.MuiButton.styleOverrides.root
                            .borderRadius,
                      }}
                      loading={loading2}
                    >
                      {loading2 ? <CircularProgress /> : "Select Analyst"}
                    </Button>
                  </CardActions>
                </Card>
              </div>
              {error && (
                <p
                  className="error"
                  style={{ color: theme.palette.error.main }}
                >
                  {error}
                </p>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
export default Role;
