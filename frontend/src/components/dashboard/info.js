import React, { useEffect, useState } from "react";
import theme from "../../styles";
import { ThemeProvider } from "styled-components";
import { Typography, IconButton, Popover } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function Info({ name }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoText, setInfoText] = useState("");
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (name === "Input") {
      setInfoText(
        "Enter your own sentence or pick a random sentence from a dataset."
      );
    } else if (name === "Model") {
      setInfoText(
        "Select the model you want to use here. Different models might predict different outputs."
      );
    } else if (name === "Sentiment") {
      setInfoText(
        "Here you can see the prediction for the given input text and the chosen model. The output can be positive or negative. There is also a confidence given which indicates the level of certainty or reliability associated with the model's output."
      );
    } else if (name === "TextShap") {
      setInfoText(
        "This gives you a textual description of the prediction and the weight of the individual words. It can help you to understand why a model came up with it's prediction by showing you the most influencial words."
      );
    } else if (name === "BarShap") {
      setInfoText(
        "This bar chart displays the influence of each word from the input text on the model's prediction. The Shapley Values displayed can have a positive or negative influence on the prediction."
      );
    } else if (name === "Prediction Correct") {
      setInfoText(
        "Tell us if the prediction was correct or not. This helps us in improving our models."
      );
    } else {
      setInfoText("For this Type are no further explanations available.");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <IconButton
          color="info"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <InfoOutlinedIcon />
        </IconButton>

        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          slotProps={{
            paper: {
              style: {
                maxWidth: "300px",
              },
            },
          }}
        >
          <Typography sx={{ p: 2 }}>{infoText}</Typography>
        </Popover>
      </div>
    </ThemeProvider>
  );
}

export default Info;
