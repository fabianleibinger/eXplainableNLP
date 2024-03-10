import React, { useState } from "react";
import { Grid, LinearProgress, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { BarChart } from "@mui/x-charts/BarChart";
import theme from "../../styles";

export const ShapleyValuesBarPlot = ({
  shapValues,
  featureNames,
  explanationRunning,
  output,
}) => {
  let color = theme.palette.chart.main;
  let contrastColor = theme.palette.chart.contrast;
  if (
    output?.label === "NEGATIVE" &&
    sessionStorage.getItem("role") === "explorer"
  ) {
    color = theme.palette.chart.contrast;
    contrastColor = theme.palette.chart.main;
  }

  const featuresToPlot = featureNames.slice(1, -1);
  const shapValuesToPlot = shapValues.slice(1, -1);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const featuresToShow = featuresToPlot.slice(startIndex, endIndex);
  const shapValuesToShow = shapValuesToPlot.slice(startIndex, endIndex);

  const totalPages = Math.ceil(featuresToPlot.length / itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (explanationRunning) {
    return <LinearProgress />;
  } else if (shapValues.length === 0) {
    return;
  } else {
    return (
      <Grid container direction="column" alignItems="center">
        <Grid item style={{ width: "100%" }}>
          <BarChart
            xAxis={[{ scaleType: "band", data: featuresToShow }]}
            yAxis={[
              {
                scaleType: "linear",
                min: Math.min(...shapValuesToPlot) - 0.02,
                max: Math.max(...shapValuesToPlot) + 0.02,
              },
            ]}
            series={[
              {
                data: shapValuesToShow,
                color: color,
              },
            ]}
            height={300}
            style={{ width: "100%" }}
          />
        </Grid>
        {totalPages > 1 && (
          <Grid item>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Grid>
        )}
      </Grid>
    );
  }
};

export const ShapleyValuesTextual = ({
  inputText,
  prediction,
  shapValues,
  featureNames,
  explanationRunning,
}) => {
  // Get the first 5 words and join them back into a string
  const words = inputText.split(" ");
  const firstFiveWords = "'" + words.slice(0, 5).join(" ") + "...'";

  const predictionLabel = prediction?.label;
  const predictionScorePercent = (prediction?.score * 100).toFixed(2);

  // Remove the first and last empty element
  const shapValuesToShow = shapValues.slice(1, -1);
  const featureNamesToShow = featureNames.slice(1, -1);

  // Create an array of dicts containing both shapValues and featureNames
  const valuesWithFeatures = shapValuesToShow.map((value, index) => ({
    value,
    feature: featureNamesToShow[index],
  }));

  // Sort the array by shapValues in descending order
  const sortedValuesWithFeatures = [...valuesWithFeatures].sort(
    (a, b) => b.value - a.value
  );

  // Extract sorted shapValues and sorted featureNames
  const sortedShapValues = sortedValuesWithFeatures.map((item) => item.value);
  const sortedFeatureNames = sortedValuesWithFeatures.map(
    (item) => item.feature
  );

  // Filter positive and negative shap values and features
  const positiveShapValuesPercent = sortedShapValues
    .filter((value) => value > 0)
    .slice(0, 5)
    .map((value) => (value * 100).toFixed(2) + "%");
  const negativeShapValuesPercent = sortedShapValues
    .filter((value) => value < 0)
    .map((value) => (value * 100).toFixed(2) + "%");
  const positiveFeatures = sortedFeatureNames
    .filter((item, index) => sortedShapValues[index] > 0)
    .slice(0, 5);
  const negativeFeatures = sortedFeatureNames.filter(
    (item, index) => sortedShapValues[index] < 0
  );

  const emphasizedWordStyle = {
    display: "inline-block",
    backgroundColor: theme.palette.background.text,
    padding: "2px 4px",
    borderRadius: "4px",
  };

  const featureStyle = {
    display: "inline-block",
    backgroundColor:
      predictionLabel === "NEGATIVE" &&
      sessionStorage.getItem("role") === "explorer"
        ? theme.palette.chart.contrast
        : theme.palette.chart.main,
    padding: "2px 4px",
    borderRadius: "4px",
  };

  const negativeFeatureStyle = {
    display: "inline-block",
    backgroundColor:
      predictionLabel === "NEGATIVE" &&
      sessionStorage.getItem("role") === "explorer"
        ? theme.palette.chart.main
        : sessionStorage.getItem("role") === "analyst"
        ? theme.palette.chart.dark
        : theme.palette.chart.contrast,
    padding: "2px 4px",
    borderRadius: "4px",
  };

  if (explanationRunning) {
    return <LinearProgress />;
  } else if (shapValues.length === 0) {
    return;
  } else {
    return (
      <div>
        <ul
          style={{
            textAlign: "left",
            listStyleType: "none",
            marginLeft: "-20px",
          }}
        >
          <li>
            The model predicted the sentiment of the input{" "}
            <Typography style={emphasizedWordStyle}>
              {firstFiveWords}
            </Typography>{" "}
            as{" "}
            <Typography style={emphasizedWordStyle}>
              {predictionLabel}
            </Typography>{" "}
            with a confidence of{" "}
            <Typography style={emphasizedWordStyle}>
              {predictionScorePercent}%
            </Typography>
            .
          </li>
          <li>
            To come to this conclusion, the model predominantly emphasized the
            following {positiveFeatures.length} words:{" "}
            <Typography style={featureStyle}>
              {positiveFeatures.join(", ")}
            </Typography>
            .
          </li>
        </ul>
        <ul>
          <li style={{ textAlign: "left" }}>
            The word{" "}
            <Typography style={featureStyle}>{positiveFeatures[0]}</Typography>{" "}
            had the strongest influence on the prediction with a score of{" "}
            <Typography style={emphasizedWordStyle}>
              {positiveShapValuesPercent[0]}
            </Typography>
            .{" "}
          </li>
          {positiveShapValuesPercent.length > 2 && (
            <li style={{ textAlign: "left" }}>
              The words{" "}
              <Typography style={featureStyle}>
                {positiveFeatures[1] + ", " + positiveFeatures[2]}
              </Typography>{" "}
              also had a considerable impact with scores of{" "}
              <Typography style={emphasizedWordStyle}>
                {positiveShapValuesPercent[1]} and{" "}
                {positiveShapValuesPercent[2]}
              </Typography>
              .
            </li>
          )}
          {negativeShapValuesPercent.length > 0 && (
            <li style={{ textAlign: "left" }}>
              The strongest counteractive influence on the prediction was
              exerted by{" "}
              <Typography style={negativeFeatureStyle}>
                {negativeFeatures.slice(-2).reverse().join(", ")}
              </Typography>{" "}
              with scores of{" "}
              <Typography style={emphasizedWordStyle}>
                {console.log(negativeShapValuesPercent)}
                {negativeShapValuesPercent.slice(-2).reverse().join(" and ")}
              </Typography>{" "}
              respectively.
            </li>
          )}
        </ul>
      </div>
    );
  }
};

export const ShapleyValuesTextPlot = ({
  shapTextPlotHTML,
  explanationRunning,
}) => {
  if (explanationRunning) {
    return <LinearProgress />;
  } else if (shapTextPlotHTML === "") {
    return;
  } else {
    return (
      <Grid container direction="column" alignItems="center">
        <div
          dangerouslySetInnerHTML={{ __html: shapTextPlotHTML }}
          style={{ width: "100%", height: "auto", border: "none" }}
        />
      </Grid>
    );
  }
};

export default ShapleyValuesBarPlot;
