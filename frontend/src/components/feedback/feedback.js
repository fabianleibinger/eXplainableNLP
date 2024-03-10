import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import React, { useState } from "react";
import styled from "styled-components";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import ReviewBanner from "./review";
import { Typography, Popover, IconButton } from "@mui/material";

export const PredictionMethod = {
  SHAP_TEXT: "Shap Text Explanation",
  SHAP_BAR: "Shap Bar Plot",
  SHAP_HTML: "Shap HTML Graph",
  COUNTERFACTUAL: "Counterfactual Explanation",
  LIME_BAR: "Lime Bar Plot",
  GENERAL: "General Feedback",
};

const BannerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  z-index: 9999;
`;

export function Feedback({
  onClick,
  selectedMethod,
  selectedModel,
  inputText,
  output,
  classificationSlider,
  shapValues,
  shapFeatures,
  shapHTMLPlot,
  perturbations,
  perturbationsPrediction,
  perturbationsCtrlCodes,
  limeExplanation,
  size,
}) {
  const [showReviewBanner, setReviewBanner] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [infoText, setInfoText] = useState("evaluate");
  const open = Boolean(anchorEl);

  const handleIconClick = () => {
    if (classificationSlider === 0.5) {
      alert("You have to tell us if the prediction was correct first");
    } else {
      setReviewBanner(true);
      onClick();
    }
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <IconButton
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={handleIconClick}
      >
        {open ? (
          <StarOutlinedIcon
            style={{
              fontSize: size ? size : "30px",
              color: theme.palette.normal.main,
            }}
          />
        ) : (
          <StarBorderOutlinedIcon
            style={{
              fontSize: size ? size : "30px",
              color: theme.palette.normal.main,
            }}
          />
        )}
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

      {showReviewBanner && (
        <BannerContainer>
          <ReviewBanner
            onClose={() => setReviewBanner(false)}
            onReviewed={() => setReviewed(true)}
            inputString={inputText}
            model={selectedModel}
            method={selectedMethod}
            prediction={output}
            classificationSlider={classificationSlider}
            shapValues={shapValues}
            shapFeatures={shapFeatures}
            shapHTMLPlot={shapHTMLPlot}
            perturbations={perturbations}
            perturbationsPrediction={perturbationsPrediction}
            perturbationsCtrlCodes={perturbationsCtrlCodes}
            limeExplanation={limeExplanation}
          />
        </BannerContainer>
      )}
    </ThemeProvider>
  );
}
