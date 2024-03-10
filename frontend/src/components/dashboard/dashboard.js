import { ThemeProvider } from "styled-components";
import theme from "../../styles";
import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";
import {
  ShapleyValuesBarPlot,
  ShapleyValuesTextPlot,
  ShapleyValuesTextual,
} from "../shap/shapleyValues";
import { LimeBarPlot } from "../lime/lime";
import ModelPrediction from "../modelprediction/ModelPrediction";
import CounterfactualExplanations from "../counterfactual-explanation/counterfactual-explanations";
import MenuItem from "@mui/material/MenuItem";
import {
  DashboardElementSubTitle,
  DashboardElementTitle,
} from "./dashboardElementTitle";
import { Feedback, PredictionMethod } from "../feedback/feedback";
import Info from "./info";
import ModelSelect from "../modelselection/modelSelection";
import CtrlCodes from "../counterfactual-explanation/ctrl-code";
import MisclassifiedButton from "../misclassfied/misclassified-button";
import ClassificationSlider from "../feedback/classificationSlider";
import { API_URL } from "../../App";

function DashboardWelcome() {
  const [role, setRole] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    "distilbert-base-uncased-finetuned-sst-2-english"
  );
  const [inputText, setInputText] = useState("");
  const [dataset, setDataset] = useState("");
  const [input, setInput] = useState([""]);
  const [classificationSlider, setClassificationSlider] = useState(0.5);
  const [savedInputText, setSavedInputText] = useState(inputText);
  const [shapTextPlotHTML, setShapTextPlotHTML] = useState("");
  const [shapValues, setShapValues] = useState([]);
  const [shapFeatures, setShapFeatures] = useState([]);
  const [limeExplanation, setLimeExplanation] = useState([]);
  const [output, setOutput] = useState("");
  const [selectedMethod, setMethod] = useState("");
  const [perturbations, setPerturbations] = useState([]);
  const [isLoadingPrediction, setLoadingPrediction] = useState(false);
  const [explanationRunning, setExplanationRunning] = useState(false);
  const [limeExplanationRunning, setLimeExplanationRunning] = useState(false);
  const [isLoadingCounterfactual, setLoadingCounterfactual] = useState(false);
  const [perturbationsPrediction, setPerturbationsPrediction] = useState([]);
  const [ctrlCodes, setCodes] = useState("");
  const [ctrlCodesPredictions, setCtrlCodesPredictions] = useState([]);
  const [loadingDataset, setLoadingDataset] = useState(false);

  useEffect(() => {
    setRole(sessionStorage.getItem("role") ?? "explorer");
  }, []);

  const handleShapExplanation = () => {
    setExplanationRunning(true);
    const request = {
      model_name: selectedModel,
      input_text: input,
    };
    axios
      .post(API_URL + "/explanation/shap-values", request)
      .then((response) => {
        setShapValues(response.data.shap_values);
        setShapFeatures(response.data.feature_names);
        setShapTextPlotHTML(response.data.plot_html);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setExplanationRunning(false);
      });
  };

  const handleLimeExplanation = () => {
    setLimeExplanationRunning(true);
    const request = {
      model_name: selectedModel,
      input_text: input,
      num_features: 10,
      num_samples: 100,
    };
    axios
      .post(API_URL + "/explanation/lime", request)
      .then((response) => {
        setLimeExplanation(response.data.explanations[0].features_values);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLimeExplanationRunning(false);
      });
  };

  const handleModelPrediction = () => {
    setLoadingPrediction(true);
    const request = {
      input_text: input,
      model_name: selectedModel,
    };
    axios
      .post(API_URL + "/generateOutput/", request)
      .then((response) => {
        setOutput(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingPrediction(false);
      });
  };

  const handleCounterfactualExplanation = () => {
    setLoadingCounterfactual(true);
    const requestBody = {
      text: inputText,
      model: selectedModel,
      ctrlCodes: ctrlCodes,
    };

    const apiUrl =
      API_URL + "/counterfactual-explanation/generate-perturbations/";
    axios
      .post(apiUrl, requestBody)
      .then((response) => {
        setPerturbations(response.data.perturbations);
        setPerturbationsPrediction(response.data.predictions);
        setCtrlCodesPredictions(response.data.ctrlCodes);
        setLoadingCounterfactual(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoadingCounterfactual(false);
      });
  };

  const dashboardItem_style = {
    minWidth: "300px",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.2)",
  };

  const handleMisclassifiedInputChange = (misclassifiedInput) => {
    setInputText(misclassifiedInput.inputString);
    setInput([misclassifiedInput.inputString]);
    setSelectedModel(misclassifiedInput.model);
  };
  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleCtrlCodes = (event) => {
    setCodes(event.target.value);
  };

  useEffect(() => {
    if (inputText !== "") {
      handleCounterfactualExplanation();
    }
  }, [ctrlCodes]);

  const handleGetExplanation = () => {
    if (inputText === "") {
      alert("Please enter some input text");
      return;
    }
    setSavedInputText(inputText);
    setClassificationSlider(0.5);

    handleModelPrediction();
    handleShapExplanation();
    if (role === "analyst") {
      handleCounterfactualExplanation();
      handleLimeExplanation();
    }
  };

  const getSentence = async (e) => {
    e.preventDefault();
    setLoadingDataset(true);
    try {
      if (dataset) {
        await axios
          .post(
            API_URL + "/randomTextFromDataset/",
            { dataset },
            { withCredentials: true }
          )
          .then(async (response) => {
            if (response.status === 200) {
              setInputText(response.data.text);
              setInput([response.data.text]);
            } else {
              console.log("Failed to load from dataset");
            }
          });
      } else {
        alert("Please select a dataset first");
      }
    } catch (error) {
      if (error.response) {
        // Error-response from the Server
        if (error.response.data.error) {
          console.log(error.response.data.error);
        }
      } else if (error.request) {
        console.log("No Response from Server");
      } else {
        console.log("Error:" + error.message);
      }
    }
    setLoadingDataset(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Grid
          container
          rowGap={3}
          columnGap={3}
          px="50px"
          pb="20px"
          marginTop="20px"
        >
          <Grid item xs={12}>
            <Typography variant="h3" marginBottom="20px">
              Sentiment Analysis
            </Typography>
          </Grid>
          <Grid item xs={8} style={dashboardItem_style}>
            <Grid container justifyContent="space-between">
              <Grid item>
                <DashboardElementTitle>Input</DashboardElementTitle>
              </Grid>
              {role === "explorer" && (
                <Grid item style={{ marginLeft: "5px" }}>
                  <Info name={"Input"} />
                </Grid>
              )}
              <Grid item style={{ marginLeft: "auto" }}>
                <InputLabel
                  id="example-label"
                  style={{ fontSize: "12px", textAlign: "left" }}
                >
                  Select a dataset
                </InputLabel>
                <Select
                  id="example-label"
                  value={dataset}
                  onChange={(event) => {
                    setDataset(event.target.value);
                  }}
                  style={{
                    width: "200px",
                    maxHeight: "30px",
                    marginRight: "20px",
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"imdb"}>IMDb</MenuItem>
                  <MenuItem
                    value={"A-Roucher/amazon_product_reviews_datafiniti"}
                  >
                    {" "}
                    Product Reviews
                  </MenuItem>
                  <MenuItem value={"app_reviews"}> App reviews</MenuItem>
                  <MenuItem value={"argilla/tripadvisor-hotel-reviews"}>
                    Hotel Reviews
                  </MenuItem>
                  <MenuItem value={"argilla/uber-reviews"}>
                    Uber Reviews
                  </MenuItem>
                  <MenuItem value={"deelow/restaurant-reviews"}>
                    Restaurant Reviews
                  </MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "20px",
                    maxHeight: "30px",
                    width: "270px",
                  }}
                  onClick={getSentence}
                >
                  {loadingDataset ? (
                    <CircularProgress size={20} style={{ color: "white" }} />
                  ) : (
                    <Typography
                      style={{
                        fontSize: "13px",
                      }}
                    >
                      {" "}
                      Get Sentence from Dataset
                    </Typography>
                  )}
                </Button>
                {role === "analyst" && (
                  <MisclassifiedButton
                    onInputSet={handleMisclassifiedInputChange}
                  />
                )}
              </Grid>
            </Grid>
            <TextField
              style={{ width: "100%" }}
              id="outlined-multiline-static"
              label="Input a sentence or text that we can analyze for sentiment."
              multiline
              rowsMax={10}
              rows={3}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setInput([e.target.value]);
                setDataset("");
              }}
            />
          </Grid>
          <Grid item xs={true} style={dashboardItem_style}>
            <Grid container>
              <Grid item>
                <DashboardElementTitle>Model</DashboardElementTitle>
              </Grid>
              {role === "explorer" && (
                <Grid item style={{ marginLeft: "5px" }}>
                  <Info name={"Model"} />
                </Grid>
              )}
            </Grid>
            <ModelSelect
              label={"Choose a model for prediction."}
              value={selectedModel}
              onChange={handleModelChange}
              style={{ marginBottom: "20px" }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ width: "100%", borderRadius: "20px" }}
              onClick={handleGetExplanation}
            >
              Get sentiment
            </Button>
          </Grid>

          <Grid item xs={6} style={dashboardItem_style}>
            <Grid container>
              <Grid item>
                <DashboardElementTitle>Sentiment</DashboardElementTitle>
              </Grid>
              {role === "explorer" && (
                <Grid item style={{ marginLeft: "5px" }}>
                  <Info name={"Sentiment"} />
                </Grid>
              )}
            </Grid>
            <ModelPrediction
              output={output}
              isLoadingPrediction={isLoadingPrediction}
            />
          </Grid>

          <Grid item xs={true} style={dashboardItem_style}>
            <Grid container>
              <Grid item>
                <DashboardElementTitle>
                  Prediction correct?
                </DashboardElementTitle>
              </Grid>
              {role === "explorer" && (
                <Grid item style={{ marginLeft: "5px" }}>
                  <Info name={"Prediction Correct"} />
                </Grid>
              )}
            </Grid>
            <ClassificationSlider
              slider={classificationSlider}
              setSlider={setClassificationSlider}
            />
          </Grid>

          <Grid item xs={12} marginTop="20px" marginBottom="20px">
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" marginBottom="10px">
              Explanations
            </Typography>
            <Typography variant="h6" marginBottom="20px">
              Try out state-of-the-art explanation methods on your
              classification task!
            </Typography>
          </Grid>

          <Grid
            item
            xs={role === "explorer" ? 12 : 7}
            style={dashboardItem_style}
          >
            <Grid container justifyContent="space-between">
              <Grid item xs={role === "explorer" ? null : 11}>
                <DashboardElementTitle>
                  Textual Explanation based on SHAP
                </DashboardElementTitle>
              </Grid>
              {role === "explorer" && (
                <Grid item style={{ marginLeft: "5px" }}>
                  <Info name={"TextShap"} />
                </Grid>
              )}
              <Grid item style={{ marginLeft: "auto" }}>
                <Feedback
                  inputText={savedInputText}
                  selectedMethod={selectedMethod}
                  selectedModel={selectedModel}
                  output={output}
                  classificationSlider={classificationSlider}
                  shapValues={shapValues}
                  shapFeatures={shapFeatures}
                  shapHTMLPlot={shapTextPlotHTML}
                  perturbations={perturbations}
                  perturbationsPrediction={perturbationsPrediction}
                  perturbationsCtrlCodes={ctrlCodesPredictions}
                  limeExplanation={limeExplanation}
                  onClick={(e) => {
                    setMethod(PredictionMethod.SHAP_TEXT);
                  }}
                />
              </Grid>
            </Grid>
            <ShapleyValuesTextual
              inputText={savedInputText}
              prediction={output}
              shapValues={shapValues}
              featureNames={shapFeatures}
              explanationRunning={explanationRunning}
            />
          </Grid>

          <Grid
            item
            xs={role === "explorer" ? 7 : true}
            style={dashboardItem_style}
          >
            <Grid container justifyContent="space-between">
              <Grid item>
                <DashboardElementTitle>Shapley Values</DashboardElementTitle>
              </Grid>
              {role === "explorer" && (
                <Grid item style={{ marginLeft: "5px" }}>
                  <Info name={"BarShap"} />
                </Grid>
              )}
              <Grid item style={{ marginLeft: "auto" }}>
                <Feedback
                  inputText={savedInputText}
                  selectedMethod={selectedMethod}
                  selectedModel={selectedModel}
                  output={output}
                  classificationSlider={classificationSlider}
                  shapValues={shapValues}
                  shapFeatures={shapFeatures}
                  shapHTMLPlot={shapTextPlotHTML}
                  perturbations={perturbations}
                  perturbationsPrediction={perturbationsPrediction}
                  perturbationsCtrlCodes={ctrlCodesPredictions}
                  limeExplanation={limeExplanation}
                  onClick={(e) => {
                    setMethod(PredictionMethod.SHAP_BAR);
                  }}
                />
              </Grid>
              <DashboardElementSubTitle>
                ... show the impact of each word on the prediction. Positive
                values contribute to the prediction, negative values counteract
                the prediction.
              </DashboardElementSubTitle>
            </Grid>
            <ShapleyValuesBarPlot
              shapValues={shapValues}
              featureNames={shapFeatures}
              explanationRunning={explanationRunning}
              output={output}
            />
          </Grid>
          {role === "analyst" && (
            <Grid item xs={5} style={dashboardItem_style}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <DashboardElementTitle>LIME Values</DashboardElementTitle>
                </Grid>
                <Grid item>
                  <Feedback
                    inputText={savedInputText}
                    selectedMethod={selectedMethod}
                    selectedModel={selectedModel}
                    output={output}
                    classificationSlider={classificationSlider}
                    shapValues={shapValues}
                    shapFeatures={shapFeatures}
                    shapHTMLPlot={shapTextPlotHTML}
                    perturbations={perturbations}
                    perturbationsPrediction={perturbationsPrediction}
                    perturbationsCtrlCodes={ctrlCodesPredictions}
                    limeExplanation={limeExplanation}
                    onClick={(e) => {
                      setMethod(PredictionMethod.LIME_BAR);
                    }}
                  />
                </Grid>
                <DashboardElementSubTitle>
                  ... show the most influencial words on the prediction. Unlike
                  SHAP, positive values indicate a positive sentiment, while
                  negative values indicate a negative sentiment.
                </DashboardElementSubTitle>
              </Grid>
              <LimeBarPlot
                limeExplanation={limeExplanation}
                explanationRunning={limeExplanationRunning}
              />
            </Grid>
          )}
          {role === "analyst" && (
            <Grid item xs={true} style={dashboardItem_style}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <DashboardElementTitle>
                    SHAP (Shapley Additive exPlanations)
                  </DashboardElementTitle>
                </Grid>
                <Grid item>
                  <Feedback
                    inputText={savedInputText}
                    selectedMethod={selectedMethod}
                    selectedModel={selectedModel}
                    output={output}
                    classificationSlider={classificationSlider}
                    shapValues={shapValues}
                    shapFeatures={shapFeatures}
                    shapHTMLPlot={shapTextPlotHTML}
                    perturbations={perturbations}
                    perturbationsPrediction={perturbationsPrediction}
                    perturbationsCtrlCodes={ctrlCodesPredictions}
                    limeExplanation={limeExplanation}
                    onClick={(e) => {
                      setMethod(PredictionMethod.SHAP_HTML);
                    }}
                  />
                </Grid>
                <DashboardElementSubTitle>
                  ... is a model-agnostic, game-theoretic approach to explain
                  the output of any model.
                </DashboardElementSubTitle>
              </Grid>
              <ShapleyValuesTextPlot
                shapTextPlotHTML={shapTextPlotHTML}
                explanationRunning={explanationRunning}
              />
            </Grid>
          )}
          {role === "analyst" && (
            <Grid item xs={12} style={dashboardItem_style}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <DashboardElementTitle>
                    Counterfactual Explanations
                  </DashboardElementTitle>
                  <DashboardElementSubTitle>
                    ... change your input text minimally to see if the model
                    makes a different prediction.
                  </DashboardElementSubTitle>
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    {" "}
                    {/* Adjust spacing as needed */}
                    <Grid item>
                      <CtrlCodes
                        ctrlCodes={ctrlCodes}
                        handleCtrlCodes={handleCtrlCodes}
                      />
                    </Grid>
                    <Grid item>
                      <Feedback
                        inputText={savedInputText}
                        selectedMethod={selectedMethod}
                        selectedModel={selectedModel}
                        output={output}
                        classificationSlider={classificationSlider}
                        shapValues={shapValues}
                        shapFeatures={shapFeatures}
                        shapHTMLPlot={shapTextPlotHTML}
                        perturbations={perturbations}
                        perturbationsPrediction={perturbationsPrediction}
                        perturbationsCtrlCodes={ctrlCodesPredictions}
                        limeExplanation={limeExplanation}
                        onClick={(e) => {
                          setMethod(PredictionMethod.COUNTERFACTUAL);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <CounterfactualExplanations
                perturbations={perturbations}
                isLoadingCounterfactual={isLoadingCounterfactual}
                predictions={perturbationsPrediction}
                ctrlCodes={ctrlCodesPredictions}
              />
            </Grid>
          )}
          <Grid item xs={true} style={dashboardItem_style}>
            <Typography
              variant="h4"
              gutterBottom
              mb="20px"
              style={{ fontWeight: 700 }}
            >
              {role === "explorer" && "Give us Feedback"}
              {role === "analyst" && "Save your Exploration"}
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              mb="20px"
              style={{ marginTop: "-20px" }}
            >
              {role === "explorer" &&
                "... to help in improving our explanations. Make sure to click the star icons above, if you want to rate individual explanation methods."}
              {role === "analyst" &&
                "... by giving us feedback. Make sure to click the star icons above, if you want to rate individual explanations."}
            </Typography>
            <Grid item xs={12}>
              <Feedback
                inputText={savedInputText}
                selectedMethod={selectedMethod}
                selectedModel={selectedModel}
                output={output}
                classificationSlider={classificationSlider}
                shapValues={shapValues}
                shapFeatures={shapFeatures}
                shapHTMLPlot={shapTextPlotHTML}
                perturbations={perturbations}
                perturbationsPrediction={perturbationsPrediction}
                perturbationsCtrlCodes={ctrlCodesPredictions}
                limeExplanation={limeExplanation}
                onClick={(e) => {
                  setMethod(PredictionMethod.GENERAL);
                }}
                size={"120px"}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default DashboardWelcome;
