import React from "react";
import { Grid, Typography } from "@mui/material";
import theme from "../../styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

function ClassificationSlider({ slider, setSlider }) {
  return (
    <Grid
      container
      justifyContent="space-between"
      style={{ paddingLeft: "20%", paddingRight: "20%" }}
    >
      <Grid item onClick={() => setSlider(0)} style={{ cursor: "pointer" }}>
        <CheckCircleRoundedIcon
          style={{
            color:
              slider < 0.5
                ? theme.palette.chart.main
                : theme.palette.chart.dark,
            fontSize: "50px",
          }}
        />
        <Typography
          style={{
            color:
              slider < 0.5
                ? theme.palette.chart.main
                : theme.palette.chart.dark,
          }}
        >
          <b>Correct</b>
        </Typography>
      </Grid>
      <Typography style={{ marginTop: "30px" }}>OR</Typography>
      <Grid item onClick={() => setSlider(1)} style={{ cursor: "pointer" }}>
        <RemoveCircleRoundedIcon
          style={{
            color:
              slider > 0.5
                ? theme.palette.chart.contrast
                : theme.palette.chart.dark,
            fontSize: "50px",
          }}
        />
        <Typography
          style={{
            color:
              slider > 0.5
                ? theme.palette.chart.contrast
                : theme.palette.chart.dark,
          }}
        >
          <b>Misclassfied</b>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ClassificationSlider;
