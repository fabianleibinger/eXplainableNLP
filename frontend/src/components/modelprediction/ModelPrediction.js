import React from "react";
import { Divider, Grid, LinearProgress, Box, Typography } from "@mui/material";
import theme from "../../styles";

function ModelPrediction({ output, isLoadingPrediction }) {
  const getLabelColor = (outputLabel) => {
    if (sessionStorage.getItem("role") === "analyst") {
      return theme.palette.normal.main;
    }
    if (outputLabel === "POSITIVE") {
      return theme.palette.chart.main;
    }
    return theme.palette.chart.contrast;
  };

  const emphasizedWordStyle = {
    display: "inline-block",
    backgroundColor: theme.palette.background.text,
    padding: "2px 4px",
    borderRadius: "4px",
  };

  return isLoadingPrediction ? (
    <LinearProgress />
  ) : (
    <Box>
      <Grid container alignItems="left" style={{ marginBottom: "8px" }}>
        <Grid item xs={6}>
          Prediction
        </Grid>
        <Grid item xs={6}>
          Confidence
        </Grid>
      </Grid>
      <Divider variant="middle" style={{ marginBottom: "8px" }} />
      <Grid container alignItems="left" style={{ marginBottom: "8px" }}>
        <Grid item xs={6} style={{ color: getLabelColor(output?.label) }}>
          {sessionStorage.getItem("role") === "analyst" && output ? (
            <Typography style={emphasizedWordStyle}>{output?.label}</Typography>
          ) : (
            output?.label
          )}
        </Grid>
        <Grid item xs={6}>
          {output?.score}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ModelPrediction;
