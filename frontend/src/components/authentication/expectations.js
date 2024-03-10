import React, { useState } from "react";
import Axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Checkbox,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  InputLabel,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../../App";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { API_URL } from "../../App";

function Expectations() {
  const [goalExpect, setGoalExpect] = useState("");
  const [methodExpect, setMethodExpect] = useState([]);
  const [taskExpect, setTaskExpect] = useState("");
  const [otherExpect, setOtherExpect] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { logedIn, setLogin } = useContext(LoginContext);
  const storedRole = sessionStorage.getItem("role");

  const setExpectations = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Axios.post(
        API_URL + "/postExpectations/",
        { goalExpect, methodExpect, taskExpect, otherExpect },
        { withCredentials: true }
      ).then(async (response) => {
        if (response.status === 201) {
          navigate("/");
        } else {
          setError("Failed to set expectations");
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
      <div className="ExpectationsForm">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Paper
            elevation={10}
            style={{
              padding: "40px",
              marginTop: "50px",
              marginBottom: "50px",
              marginLeft: "500px",
              marginRight: "500px",
            }}
          >
            <Typography variant="h4" align="center" color="primary" mb="20px">
              Your Expectations
            </Typography>
            <InputLabel id="goal-label">
              What is your goal of using the app?
              <span style={{ color: "red" }}>
                <b>*</b>
              </span>
            </InputLabel>
            <Select
              id="goalExpect"
              labelId="goal-label"
              value={goalExpect}
              onChange={(event) => {
                setGoalExpect(event.target.value);
              }}
              style={{
                minWidth: "100px",
                width: "500px",
                maxHeight: "35px",
                marginBottom: "20px",
              }}
            >
              <MenuItem value={"Debugging"}>Debugging</MenuItem>
              <MenuItem value={"Compliance"}>Compliance</MenuItem>
              <MenuItem value={"Build trust"}>Build trust</MenuItem>
              <MenuItem value={"Research"}>Research</MenuItem>
            </Select>
            {storedRole === "analyst" && (
              <div>
                <InputLabel id="methods-label">
                  What explainability method are you most interested in?
                </InputLabel>
                <Select
                  labelId="methods-label"
                  id="methods"
                  value={methodExpect}
                  onChange={(event) => {
                    setMethodExpect(event.target.value);
                  }}
                  style={{
                    minWidth: "100px",
                    width: "500px",
                    maxHeight: "35px",
                    marginBottom: "5px",
                  }}
                >
                  <MenuItem value={"Shapley Values"}>Shapley Values</MenuItem>
                  <MenuItem value={"Lime"}>LIME</MenuItem>
                  <MenuItem value={"Counterfactual Explanations"}>Counterfactual</MenuItem>
                  <MenuItem value={"Other"}>
                    Other (Please enter your proposal below)
                  </MenuItem>
                </Select>
              </div>
            )}
            {methodExpect === "Other" && (
              <>
                <InputLabel id="other-label">
                  What explainability method should we add to XNLP?
                </InputLabel>
                <TextField
                  labelId="other-label"
                  value={otherExpect}
                  style={{
                    minWidth: "100px",
                    width: "500px",
                    maxHeight: "35px",
                    marginBottom: "20px",
                  }}
                  onChange={(event) => setOtherExpect(event.target.value)}
                />
              </>
            )}
            <Grid item marginTop="20px">
              <InputLabel id="task-label">
                What NLP task are you most interested in?
              </InputLabel>
              <TextField
                labelId="task-label"
                placeholder="Your text"
                style={{
                  minWidth: "100px",
                  width: "500px",
                  height: "70px",
                }}
                onChange={(event) => setTaskExpect(event.target.value)}
              />
            </Grid>
            {error && (
              <p className="error" style={{ color: theme.palette.error.main }}>
                {error}
              </p>
            )}
            <Grid item>
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
                  onClick={(e) => setExpectations(e)}
                  style={{
                    borderRadius:
                      theme.components.MuiButton.styleOverrides.root
                        .borderRadius,
                    minWidth: "200px",
                  }}
                  loading={loading}
                >
                  {loading ? <CircularProgress /> : "SUBMIT"}
                </Button>
              </div>
            </Grid>
          </Paper>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
export default Expectations;
