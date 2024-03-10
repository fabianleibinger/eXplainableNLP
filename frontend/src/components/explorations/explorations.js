import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Typography,
  Stack,
  TextField,
  Autocomplete,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import ModelSelect from "../modelselection/modelSelection";
import { PredictionMethod } from "../feedback/feedback";
import CustomRating from "../feedback/rating";
import ExplorationTable from "./explorationTable";
import { API_URL } from "../../App";

function Explorations() {
  const [inputText, setInputText] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const [classified, setClassified] = useState(["correct", "incorrect"]);
  const [markedMethod, setMarkedMethod] = useState("");
  const [rating, setRating] = useState(0);
  const [explorations, setExplorations] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const location = useLocation();
  const statistics = location.pathname === "/statistics" ? true : false;

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };
  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const handleGoalChange = (event) => {
    setSelectedGoal(event.target.value);
  };
  const handleClassifiedChange = (event, newValue) => {
    setClassified(newValue);
  };
  const handleMarkedMethodChange = (event) => {
    setMarkedMethod(event.target.value);
  };

  const roleOptions = [
    {
      label: "Explorer",
      value: "explorer",
    },
    {
      label: "Analyst",
      value: "analyst",
    },
  ];

  useEffect(() => {
    handleExplorations();
  }, []);

  const handleExplorations = () => {
    setTableLoading(true);
    const queryParams = {
      inputText: inputText,
      model: selectedModel,
      role: selectedRole,
      method: markedMethod,
      classified: classified,
      goal_Expect: selectedGoal,
      rating: rating,
      statistics: statistics,
    };

    // Construct the query string
    const queryString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join("&");

    const apiUrl = API_URL + `/explorations?${queryString}`;

    axios
      .get(apiUrl, { withCredentials: true })
      .then((response) => {
        setExplorations(response.data.explorations);
      })
      .catch((error) => {
        console.log(error);
        setExplorations([]);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const gridStyle = {
    minWidth: "300px",
    borderRadius: "10px",
    boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.2)",
    padding: "20px",
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Grid
          container
          px="50px"
          pb="20px"
          marginTop="20px"
          rowGap={2}
          columnGap={1}
        >
          {statistics ? (
            <Grid item xs={12}>
              <Typography variant="h3" marginBottom="10px">
                User Feedback
              </Typography>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="h3" marginBottom="10px">
                Explorations
              </Typography>
              <Typography variant="h6" marginBottom="20px">
                Filter your previously explored explanations!
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} style={gridStyle}>
            <Grid container spacing={2}>
              <Grid item xs={statistics ? 2 : 3.6}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Input Text"
                  variant="outlined"
                  value={inputText}
                  onChange={handleInputChange}
                />
              </Grid>
              {statistics && (
                <Grid item xs={1}>
                  <TextField
                    label={"Role"}
                    select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    style={{}}
                    fullWidth
                    acceptNoSelection={true}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              {statistics && (
                <Grid item xs={1.3}>
                  <TextField
                    label={"Goal"}
                    select
                    value={selectedGoal}
                    onChange={handleGoalChange}
                    style={{}}
                    fullWidth
                    acceptNoSelection={true}
                  >
                    <MenuItem value="">
                      <em>Any</em>
                    </MenuItem>
                    <MenuItem value={"Debugging"}>Debugging</MenuItem>
                    <MenuItem value={"Compliance"}>Compliance</MenuItem>
                    <MenuItem value={"Build trust"}>Build trust</MenuItem>
                    <MenuItem value={"Research"}>Research</MenuItem>
                  </TextField>
                </Grid>
              )}
              <Grid item xs={statistics ? 1.8 : 2}>
                <ModelSelect
                  label="Model"
                  value={selectedModel}
                  onChange={handleModelChange}
                  style={{}}
                  acceptNoSelection={true}
                />
              </Grid>
              <Grid item xs={2.6}>
                <Autocomplete
                  fullWidth
                  multiple
                  id="tags-outlined"
                  options={["correct", "incorrect"]}
                  getOptionLabel={(option) => option}
                  value={classified}
                  onChange={handleClassifiedChange}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Classification" />
                  )}
                />
              </Grid>
              <Grid item xs={statistics ? 1.8 : 2.2}>
                <TextField
                  fullWidth
                  label="Feedback Focus"
                  select
                  value={markedMethod}
                  onChange={handleMarkedMethodChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  {Object.entries(PredictionMethod).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={1.5}>
                <Stack fullWidth direction="column" alignItems="center">
                  <Typography
                    variant="h7"
                    marginBottom="5px"
                    onClick={() => setRating(0)}
                  >
                    Rating
                  </Typography>
                  <CustomRating
                    value={rating}
                    precision={1}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    showLabel={true}
                    direction="column"
                  />
                </Stack>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              style={{ width: "100%", borderRadius: "20px", marginTop: "20px" }}
              onClick={handleExplorations}
            >
              Search for explorations
            </Button>
          </Grid>
          <Grid item xs={12} style={gridStyle}>
            {tableLoading ? (
              <CircularProgress />
            ) : (
              <ExplorationTable
                explorations={explorations}
                statistics={statistics}
              />
            )}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default Explorations;
