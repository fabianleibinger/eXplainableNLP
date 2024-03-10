import React from "react";
import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SentimentSatisfiedRoundedIcon from "@mui/icons-material/SentimentSatisfiedRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentNeutralRoundedIcon from "@mui/icons-material/SentimentNeutralRounded";

const getIconBySentiment = (sentiment) => {
  switch (sentiment.toLowerCase()) {
    case "negative":
      return (
        <div style={{ display: "flex" }}>
          <SentimentDissatisfiedRoundedIcon
            style={{ marginRight: "5px", color: "#e84343" }}
          />
          <Typography variant="body1" color="#e84343">
            Negative
          </Typography>
        </div>
      );
    case "neutral":
      return (
        <div style={{ display: "flex" }}>
          <SentimentNeutralRoundedIcon
            style={{ marginRight: "5px", color: "#f2b716" }}
          />
          <Typography variant="body1" color="#f2b716">
            Neutral
          </Typography>
        </div>
      );
    case "positive":
      return (
        <div style={{ display: "flex" }}>
          <SentimentSatisfiedRoundedIcon
            style={{ marginRight: "5px", color: "#1eb21e" }}
          />
          <Typography variant="body1" color="#1eb21e">
            Positive
          </Typography>
        </div>
      );
    default:
      return null;
  }
};

const CounterfactualExplanations = ({
  perturbations,
  isLoadingCounterfactual,
  predictions,
  ctrlCodes,
}) => {
  return (
    <div>
      {isLoadingCounterfactual ? (
        <div style={{ margin: "25px 0px" }}>
          <LinearProgress />
        </div>
      ) : (
        perturbations.length !== 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Explanation
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Prediction
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Control Code
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {perturbations.map((perturbation, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{perturbation}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        {getIconBySentiment(predictions[index])}
                      </div>
                    </TableCell>
                    {ctrlCodes !== null && (
                      <TableCell>{ctrlCodes[index]}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </div>
  );
};

export default CounterfactualExplanations;
