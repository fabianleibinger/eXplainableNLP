import React, { useState } from "react";
import {
  Button,
  Paper,
  Typography,
  InputLabel,
  Grid,
  TextField,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomRating from "./rating";
import Box from "@mui/material/Box";
import Axios from "axios";
import { API_URL } from "../../App";

function ReviewBanner({
  onClose,
  onReviewed,
  inputString,
  model,
  method,
  prediction,
  classificationSlider,
  shapValues,
  shapFeatures,
  shapHTMLPlot,
  perturbations,
  perturbationsPrediction,
  perturbationsCtrlCodes,
  limeExplanation,
}) {
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePostReview() {
    try {
      setLoading(true);
      console.log(inputString);
      let classifiedCorrectly = true;
      if (classificationSlider > 0.5) {
        classifiedCorrectly = false;
      }
      console.log(classifiedCorrectly);
      await Axios.post(
        API_URL + "/postFeedback/",
        {
          inputString,
          model,
          method,
          prediction,
          shapValues,
          shapFeatures,
          shapHTMLPlot,
          perturbations,
          perturbationsPrediction,
          perturbationsCtrlCodes,
          limeExplanation,
          classifiedCorrectly,
          rating,
          comment,
        },
        { withCredentials: true }
      ).then(async (response) => {
        if (response.status === 201) {
          onClose();
          onReviewed();
        } else {
          setError("Failed to post your review");
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
      setLoading(false);
    }
  }

  return (
    <Paper
      elevation={5}
      style={{
        padding: "40px",
        borderRadius: "8px",
        minWidth: "400px",
      }}
    >
      <Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h4" color="primary">
            <b>Feedback </b>
          </Typography>{" "}
          <Button onClick={onClose}>
            <CloseIcon />
          </Button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Typography style={{ textAlign: "left" }}>
            <b>Method:</b>{" "}
            {method === "General Feedback" ? "Save to explorations" : method}
          </Typography>
          <Typography style={{ textAlign: "left" }}>
            <b>Model:</b> {model}
          </Typography>
          <Typography style={{ textAlign: "left" }}>
            <b>Input:</b> {inputString}
          </Typography>
        </div>
        <Divider
          variant="middle"
          style={{
            marginTop: "10px",
            marginBottom: "20px",
            marginLeft: "0px",
            marginRight: "0px",
          }}
        />
        <Stack spacing={6} direction="row" style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography>
              <b>
                {method === "General Feedback"
                  ? "How would you rate these explanations?"
                  : "How would you rate this explanation?"}
                <span style={{ color: "red" }}>*</span>
              </b>
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 120,
                display: "flex",
                alignItems: "left",
              }}
            >
              <CustomRating
                value={rating}
                precision={1}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                showLabel={true}
                direction="row"
              />
            </Box>
          </div>
        </Stack>
        <InputLabel id="text-label" style={{ textAlign: "left" }}>
          <p>
            <b>Leave a comment:</b> <br />
            {method === "General Feedback" ? (
              <>
                How did the explanations help you in understanding the model
                predictions?
                <br />
                What did you like or dislike about the explanations?
              </>
            ) : (
              <>
                How did the explanation help you in understanding the model
                prediction?
                <br />
                What did you like or dislike about the explanation?
              </>
            )}
          </p>
        </InputLabel>
        <TextField
          labelId="text-label"
          id="reviewText"
          name="reviewText"
          required
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          multiline
          style={{ width: "100%" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
          }}
        >
          <Button variant="outlined" size="small" onClick={handlePostReview}>
            {loading ? "Posting..." : "Leave review"}
          </Button>
        </div>
      </Grid>
    </Paper>
  );
}

export default ReviewBanner;
