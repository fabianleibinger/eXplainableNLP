import React from "react";
import { Grid, LinearProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import theme from "../../styles";

export const LimeBarPlot = ({
  limeExplanation,
  explanationRunning,
}) => {
    if (explanationRunning) {
    return <LinearProgress />;
  } else if (limeExplanation.length === 0) {
    return;
  } else {
    return (
      <Grid container direction="column" alignItems="center">
        <Grid item style={{ width: "100%" }}>
          <BarChart
            xAxis={[
              { scaleType: "band", data: limeExplanation.map((x) => x[0]) },
            ]}
            series={[
              {
                data: limeExplanation.map((x) => x[1]),
                color: theme.palette.chart.light,
              },
            ]}
            height={300}
            style={{ width: "100%" }}
          />
        </Grid>
      </Grid>
    );
  }
};

export default LimeBarPlot;
