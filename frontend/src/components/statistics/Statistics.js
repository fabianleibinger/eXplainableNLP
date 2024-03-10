import React, { useEffect, useState } from "react";
import Axios from "axios";
import theme from "../../styles";
import { ThemeProvider } from "styled-components";
import {
  MenuItem,
  Select,
  Typography,
  InputLabel,
  Grid,
  CircularProgress,
} from "@mui/material";
import { DashboardElementTitle } from "../dashboard/dashboardElementTitle";

import { BarChart, PieChart } from "@mui/x-charts";
import Explorations from "../explorations/explorations";
import { API_URL } from "../../App";

function Statistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allGoals, setAllGoals] = useState("");
  const [allGoalsExplorer, setAllGoalsExplorer] = useState("");
  const [allGoalsAnalyst, setAllGoalsAnalyst] = useState("");
  const [expectationsMethodAnalyst, setExpectationsMethodAnalyst] =
    useState("");
  const [numberFeedback, setNumberFeedback] = useState(0);
  const [numberFeedbackExplorer, setNumberFeedbackExplorer] = useState(0);
  const [numberFeedbackAnalyst, setNumberFeedbackAnalyst] = useState(0);
  const [numberUsers, setNumberUsers] = useState(0);
  const [numberExplorer, setNumberExplorer] = useState(0);
  const [numberAnalyst, setNumberAnalyst] = useState(0);
  const [avgRatingExplorer, setAvgRatingExplorer] = useState(0);
  const [avgRatingAnalyst, setAvgRatingAnalyst] = useState(0);
  const [percentageMisclassified, setPercentageMisclassified] = useState(0);
  const [roleAvgMethod, setRoleAvgMethod] = useState(" ");
  const [roleExpectations, setRoleExpectations] = useState(" ");
  const [goalExpectations, setGoalExpectations] = useState(" ");
  const [dataBar, setDataBar] = useState("");
  const [selectedClassification, setClassifiction] = useState(" ");

  useEffect(() => {
    try {
      setLoading(true);
      Axios.get(API_URL + "/getStatistics/", {
        withCredentials: true,
      }).then(async (response) => {
        if (response.status === 200) {
          setAllGoals(response.data.allGoals);
          setAllGoalsExplorer(response.data.allGoalsExplorer);
          setAllGoalsAnalyst(response.data.allGoalsAnalyst);
          setExpectationsMethodAnalyst(response.data.expectationsMethodAnalyst);
          setNumberFeedback(response.data.numberFeedback);
          setNumberFeedbackExplorer(response.data.numberFeedbackExplorer);
          setNumberFeedbackAnalyst(response.data.numberFeedbackAnalyst);
          setNumberUsers(response.data.numberUser);
          setNumberExplorer(response.data.numberExplorer);
          setNumberAnalyst(response.data.numberAnalyst);
          setAvgRatingExplorer(response.data.avgRatingExplorer);
          setAvgRatingAnalyst(response.data.avgRatingAnalyst);
          setPercentageMisclassified(response.data.percentageMisclassified);
          setDataBar(response.data.avgRatingMethod);
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
  }, []);

  const StatisticsItem_style = {
    minWidth: "300px",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.2)",
  };

  function filterExpectations(classification, role, goal) {
    const queryParams = {
      classification: classification,
      role: role,
      goalExpect: goal,
    };

    const queryString = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join("&");
    try {
      Axios.get(API_URL + `/getStatisticsForGoal?${queryString}`, {
        withCredentials: true,
      }).then(async (response) => {
        if (response.status === 200) {
          setDataBar(response.data.filteredMethods);
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
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: "20px" }}>
        {loading && <CircularProgress />}
        <Grid
          container
          rowGap={4}
          columnGap={4}
          px="50px"
          pb="20px"
          marginTop="20px"
        >
          <Grid item xs={12}>
            <Typography
              variant="h3"
              marginBottom="20px"
              style={{ textAlign: "center" }}
            >
              Statistics
            </Typography>
          </Grid>
          <Grid item xs style={StatisticsItem_style}>
            <Grid item>
              <DashboardElementTitle>Number of Users</DashboardElementTitle>
            </Grid>
            <Grid container rowGap={2} marginTop={4}>
              <Grid
                container
                item
                justifyContent="space-between"
                style={{ marginBottom: "8px" }}
              >
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Total Number:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b>{numberUsers}</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                item
                justifyContent="space-between"
                style={{ marginBottom: "8px" }}
              >
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Number of Explorers:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b> {numberExplorer}</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container item justifyContent="space-between">
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Number of Analysts
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b> {numberAnalyst}</b>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs style={StatisticsItem_style}>
            <Grid item>
              <DashboardElementTitle>Number of Feedbacks</DashboardElementTitle>
            </Grid>
            <Grid container rowGap={2} marginTop={4}>
              <Grid
                container
                item
                justifyContent="space-between"
                style={{ marginBottom: "8px" }}
              >
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Total Number:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b>{numberFeedback}</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                item
                justifyContent="space-between"
                style={{ marginBottom: "8px" }}
              >
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Feedbacks by Explorers:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b>{numberFeedbackExplorer}</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container item justifyContent="space-between">
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Feedbacks by Analysts
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b>{numberFeedbackAnalyst}</b>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs style={StatisticsItem_style}>
            <Grid item>
              <DashboardElementTitle>Feedback Facts</DashboardElementTitle>
            </Grid>
            <Grid container rowGap={2} marginTop={4}>
              <Grid
                container
                item
                justifyContent="space-between"
                style={{ marginBottom: "8px" }}
              >
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Average Rating of Explorers:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b>{avgRatingExplorer.toFixed(2)}</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                item
                justifyContent="space-between"
                style={{ marginBottom: "8px" }}
              >
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Average Rating of Analysts:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b> {avgRatingAnalyst.toFixed(2)}</b>
                  </Typography>
                </Grid>
              </Grid>

              <Grid container item justifyContent="space-between">
                <Grid>
                  <Typography style={{ fontSize: "20px" }}>
                    Percentage of misclassified:
                  </Typography>
                </Grid>
                <Grid>
                  <Typography style={{ fontSize: "20px", marginRight: "10px" }}>
                    <b> {percentageMisclassified.toFixed(2)}%</b>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} style={StatisticsItem_style}>
            <Grid container justifyContent="space-between">
              <Grid item>
                <DashboardElementTitle>
                  Users per Expected Goal
                </DashboardElementTitle>
              </Grid>
              <Grid item style={{ marginLeft: "auto" }}>
                <InputLabel
                  id="role-label"
                  style={{ fontSize: "12px", textAlign: "left" }}
                >
                  Select a role
                </InputLabel>
                <Select
                  id="role-label"
                  value={roleExpectations}
                  onChange={(event) => {
                    setRoleExpectations(event.target.value);
                  }}
                  style={{
                    width: "200px",
                    maxHeight: "30px",
                    marginRight: "20px",
                  }}
                >
                  <MenuItem value={" "}>Any</MenuItem>
                  <MenuItem value={"explorer"}>Explorer</MenuItem>
                  <MenuItem value={"analyst"}>Analyst</MenuItem>
                </Select>
              </Grid>
            </Grid>
            {!allGoals || allGoals.length === 0 ? (
              <Typography>No data available</Typography>
            ) : (
              <PieChart
                series={[
                  {
                    data:
                      roleExpectations === " "
                        ? allGoals.map((item) => ({
                            value: item.count,

                            label: item.goal_Expect,
                          }))
                        : roleExpectations === "explorer"
                        ? allGoalsExplorer.map((item) => ({
                            value: item.count,
                            label: item.goal_Expect,
                          }))
                        : allGoalsAnalyst.map((item) => ({
                            value: item.count,
                            label: item.goal_Expect,
                          })),
                    color: theme.palette.chart.light,
                  },
                ]}
                height={300}
                style={{ width: "100%" }}
              />
            )}
          </Grid>

          <Grid item xs style={StatisticsItem_style}>
            <Grid container justifyContent="space-between">
              <Grid item>
                <DashboardElementTitle>
                  Expected Methods of analysts
                </DashboardElementTitle>
              </Grid>
            </Grid>
            {!expectationsMethodAnalyst ||
            expectationsMethodAnalyst.length === 0 ? (
              <Typography>No data available</Typography>
            ) : (
              <PieChart
                series={[
                  {
                    data: expectationsMethodAnalyst.map((item) => ({
                      value: item.count,
                      label:
                        item.method_Expect === "Counterfactual Explanations"
                          ? "Counterfactuals"
                          : item.method_Expect,
                    })),
                    color: theme.palette.chart.light,
                  },
                ]}
                height={300}
                style={{ width: "100%" }}
              />
            )}
          </Grid>

          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            style={StatisticsItem_style}
          >
            <Grid item xs={6}>
              <DashboardElementTitle>
                Average Rating per Method
              </DashboardElementTitle>
            </Grid>
            <Grid item container xs={6} justifyContent="flex-end">
              <Grid item>
                <InputLabel
                  id="classified-label"
                  style={{ fontSize: "12px", textAlign: "left" }}
                >
                  Classification
                </InputLabel>
                <Select
                  id="classified-label"
                  value={selectedClassification}
                  onChange={(event) => {
                    setClassifiction(event.target.value);
                    filterExpectations(
                      event.target.value,
                      roleAvgMethod,
                      goalExpectations
                    );
                  }}
                  style={{
                    width: "200px",
                    maxHeight: "30px",
                    marginRight: "20px",
                  }}
                >
                  <MenuItem value={" "}>Any</MenuItem>
                  <MenuItem value={"true"}>Correct</MenuItem>
                  <MenuItem value={"false"}>Incorrect</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <InputLabel
                  id="role-label"
                  style={{ fontSize: "12px", textAlign: "left" }}
                >
                  Select a role
                </InputLabel>
                <Select
                  id="role-label"
                  value={roleAvgMethod}
                  onChange={(event) => {
                    setRoleAvgMethod(event.target.value);
                    filterExpectations(
                      selectedClassification,
                      event.target.value,
                      goalExpectations
                    );
                  }}
                  style={{
                    width: "200px",
                    maxHeight: "30px",
                    marginRight: "20px",
                  }}
                >
                  <MenuItem value={" "}>Any</MenuItem>
                  <MenuItem value={"explorer"}>Explorer</MenuItem>
                  <MenuItem value={"analyst"}>Analyst</MenuItem>
                </Select>
              </Grid>
              <Grid item>
                <InputLabel
                  id="goal-label"
                  style={{ fontSize: "12px", textAlign: "left" }}
                >
                  Select an expected Goal
                </InputLabel>
                <Select
                  id="goal-label"
                  value={goalExpectations}
                  onChange={(event) => {
                    setGoalExpectations(event.target.value);
                    filterExpectations(
                      selectedClassification,
                      roleAvgMethod,
                      event.target.value
                    );
                  }}
                  style={{
                    width: "200px",
                    maxHeight: "30px",
                    marginRight: "20px",
                  }}
                >
                  <MenuItem value={" "}>Any</MenuItem>
                  <MenuItem value={"Debugging"}>Debugging</MenuItem>
                  <MenuItem value={"Compliance"}>Compliance</MenuItem>
                  <MenuItem value={"Build trust"}>Build trust</MenuItem>
                  <MenuItem value={"Research"}>Research</MenuItem>
                </Select>
              </Grid>
            </Grid>

            {!dataBar || dataBar.length === 0 ? (
              <Typography>No data available</Typography>
            ) : (
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: dataBar.map((item) => item.method),
                  },
                ]}
                yAxis={[{ label: "Average Rating" }]}
                series={[
                  {
                    data: dataBar.map((item) => item.avg_rating),
                    color: theme.palette.chart.light,
                  },
                ]}
                height={300}
                style={{ width: "100%" }}
              />
            )}
          </Grid>
        </Grid>
      </div>
      <Explorations />
    </ThemeProvider>
  );
}

export default Statistics;
