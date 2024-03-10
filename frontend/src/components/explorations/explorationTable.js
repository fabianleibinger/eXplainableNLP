import React, { useState } from "react";
import theme from "../../styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Box,
  IconButton,
  Chip,
  Rating,
  Stack,
  Tooltip,
  Typography,
  Pagination,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  ShapleyValuesBarPlot,
  ShapleyValuesTextual,
  ShapleyValuesTextPlot,
} from "../shap/shapleyValues";
import CounterfactualExplanations from "../counterfactual-explanation/counterfactual-explanations";
import LimeBarPlot from "../lime/lime";
import { PredictionMethod } from "../feedback/feedback";

function ExplorationTable({ explorations, statistics }) {
  function createData(
    inputString,
    model,
    role,
    method,
    prediction,
    classifiedCorrectly,
    shapValues,
    shapFeatures,
    shapHTMLPlot,
    perturbations,
    perturbationsPrediction,
    perturbationsCtrlCodes,
    limeExplanation,
    rating,
    comment,
    created_at
  ) {
    shapValues = JSON.parse(shapValues);
    shapFeatures = JSON.parse(adjustStringShapLime(shapFeatures));
    perturbations = stringPerturbationsToJSON(perturbations);
    perturbationsPrediction = stringPerturbationsToJSON(
      perturbationsPrediction
    );
    perturbationsCtrlCodes = stringPerturbationsToJSON(perturbationsCtrlCodes);
    limeExplanation = JSON.parse(adjustStringShapLime(limeExplanation));
    created_at = new Date(created_at).toLocaleString();
    return {
      inputString,
      model,
      role,
      method,
      prediction,
      classifiedCorrectly,
      rating,
      created_at,
      comment,
      explanations: {
        shapValues,
        shapFeatures,
        shapHTMLPlot,
        perturbations,
        perturbationsPrediction,
        perturbationsCtrlCodes,
        limeExplanation,
      },
    };
  }

  function adjustStringShapLime(str) {
    // Replace double quotes inside single quotes with single quotes
    str = str.replace(/"([^']*)"/g, "'$1'");
    // Replace single quotes outside double quotes with double quotes
    str = str.replace(/'(?=(?:[^"]*"[^"]*")*[^"]*$)/g, '"');
    return str;
  }

  function stringPerturbationsToJSON(str) {
    const pattern = /(['"])(.*?)\1/g;
    const matches = str.match(pattern);
    str = matches?.map((match) => match.replace(/['"]/g, ""));
    return str;
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const methodToPageMap = {
      [PredictionMethod.MODEL_PREDICTION]: 1,
      [PredictionMethod.SHAP_TEXT]: 1,
      [PredictionMethod.SHAP_BAR]: 2,
      [PredictionMethod.SHAP_HTML]: 3,
      [PredictionMethod.COUNTERFACTUAL]: 5,
      [PredictionMethod.LIME_BAR]: 4,
      [PredictionMethod.GENERAL]: 1,
    };

    const setPageForMethod = (method) => {
      return methodToPageMap[method];
    };

    const totalPages = 5;
    const [currentPage, setCurrentPage] = useState(
      setPageForMethod(row?.method)
    );
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

    const classifiedIconStyle = {
      color: row?.classifiedCorrectly
        ? theme.palette.chart.main
        : theme.palette.chart.contrast,
      fontSize: "33px",
    };

    return (
      <React.Fragment>
        <TableRow style={{ backgroundColor: open ? "#f2f2f2" : "inherit" }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row?.inputString}
          </TableCell>
          {statistics && (
            <TableCell align="right">
              {row?.role === "analyst" ? "Analyst" : "Explorer"}
            </TableCell>
          )}
          <TableCell align="right">{row?.model}</TableCell>
          <TableCell align="right">
            <Stack direction="row" spacing={1}>
              <Chip
                label={row?.prediction.label + ", " + row?.prediction.score}
              />
              {row?.classifiedCorrectly ? (
                <Tooltip title="correct">
                  <CheckCircleRoundedIcon style={classifiedIconStyle} />
                </Tooltip>
              ) : (
                <Tooltip title="incorrect">
                  <RemoveCircleRoundedIcon style={classifiedIconStyle} />
                </Tooltip>
              )}
            </Stack>
          </TableCell>
          <TableCell align="right">{row?.method}</TableCell>
          <TableCell align="right">
            <Rating name="star-rating" value={row?.rating} readOnly />
          </TableCell>
          <TableCell align="right">{row?.created_at}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
            }}
            colSpan={7}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  margin: 1,
                  marginBottom: 4,
                  flexDirection: "column",
                }}
              >
                {row?.comment && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Your comment
                    </Typography>
                    <Chip label={"'" + row.comment + "'"} color="primary" />
                  </>
                )}
                <Typography
                  variant="h5"
                  gutterBottom
                  marginTop={3}
                  marginBottom={1}
                >
                  Explanations
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
                {currentPage === 1 && (
                  <div>
                    <Typography variant="h6" marginTop={2}>
                      Textual Explanation based on SHAP
                    </Typography>
                    {row?.explanations?.shapValues &&
                    isNaN(row?.explanations?.shapValues) ? (
                      <ShapleyValuesTextual
                        inputText={row?.inputString}
                        prediction={row?.prediction}
                        shapValues={row?.explanations?.shapValues}
                        featureNames={row?.explanations?.shapFeatures}
                        explanationRunning={false}
                      />
                    ) : (
                      <Typography marginTop={2}>
                        Textual description is not available for this exploration
                      </Typography>
                    )}
                  </div>
                )}
                {currentPage === 2 && (
                  <div>
                    <Typography variant="h6" marginTop={2}>
                      Shapley Values
                    </Typography>
                    {row?.explanations?.shapFeatures &&
                    isNaN(row?.explanations?.shapFeatures) ? (
                      <ShapleyValuesBarPlot
                        shapValues={row?.explanations?.shapValues}
                        featureNames={row?.explanations?.shapFeatures}
                        explanationRunning={false}
                        output={row?.prediction}
                      />
                    ) : (
                      <Typography marginTop={2}>
                        Shap BarPlot is not available for this exploration
                      </Typography>
                    )}
                  </div>
                )}
                {currentPage === 3 && (
                  <div>
                    <Typography variant="h6" marginTop={2}>
                      SHAP (Shapley Additive exPlanations)
                    </Typography>
                    {row?.explanations?.shapHTMLPlot &&
                    isNaN(row?.explanations?.shapHTMLPlot) ? (
                      <ShapleyValuesTextPlot
                        shapTextPlotHTML={row?.explanations?.shapHTMLPlot}
                        explanationRunning={false}
                      />
                    ) : (
                      <Typography marginTop={2}>
                        ShapHTML Plot is not available for this exploration
                      </Typography>
                    )}
                  </div>
                )}
                {currentPage === 4 && (
                  <div>
                    <Typography variant="h6" marginTop={2}>
                      LIME (Local Interpretable Model-agnostic Explanations)
                      Values
                    </Typography>
                    {row?.explanations?.limeExplanation &&
                    isNaN(row?.explanations?.limeExplanation) ? (
                      <LimeBarPlot
                        limeExplanation={row?.explanations?.limeExplanation}
                        explanationRunning={false}
                      />
                    ) : (
                      <Typography marginTop={2}>
                        LIME is not available for this exploration
                      </Typography>
                    )}
                  </div>
                )}
                {currentPage === 5 && (
                  <div>
                    <Typography variant="h6" marginTop={2}>
                      Counterfactual Explanations
                    </Typography>
                    {row?.explanations?.perturbations &&
                    isNaN(row?.explanations?.perturbations) ? (
                      <CounterfactualExplanations
                        perturbations={row?.explanations?.perturbations}
                        isLoadingCounterfactual={false}
                        predictions={row?.explanations?.perturbationsPrediction}
                        ctrlCodes={row?.explanations?.perturbationsCtrlCodes}
                      />
                    ) : (
                      <Typography marginTop={2}>
                        Counterfactuals are not available for this exploration
                      </Typography>
                    )}
                  </div>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const slicedExplorations = explorations.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div>
      <TableContainer sx={{ marginBottom: "20px" }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Input Text</TableCell>
              {statistics && <TableCell align="right">Role</TableCell>}
              <TableCell align="right">Model</TableCell>
              <TableCell align="right">Prediction</TableCell>
              <TableCell align="right">Method</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedExplorations.map((exploration, index) => (
              <Row
                key={index}
                row={createData(
                  exploration.inputString,
                  exploration.model,
                  statistics && exploration.role,
                  exploration.method,
                  exploration.prediction,
                  exploration.classifiedCorrectly,
                  exploration.shapValues,
                  exploration.shapFeatures,
                  exploration.shapHTMLPlot,
                  exploration.perturbations,
                  exploration.perturbationsPrediction,
                  exploration.perturbationsCtrlCodes,
                  exploration.limeExplanation,
                  exploration.rating,
                  exploration.comment,
                  exploration.created_at
                )}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(explorations.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
      />
    </div>
  );
}

export default ExplorationTable;
