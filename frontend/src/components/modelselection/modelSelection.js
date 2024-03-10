import React from "react";
import { TextField, MenuItem } from "@mui/material";

const ModelSelect = ({ label, value, onChange, style, acceptNoSelection }) => {
  const modelOptions = [
    {
      label: "Roberta Large English",
      value: "siebert/sentiment-roberta-large-english",
    },
    {
      label: "Distilbert Base Uncased",
      value: "distilbert-base-uncased-finetuned-sst-2-english",
    },
  ];

  if (sessionStorage.getItem("role") === "analyst") {
    modelOptions.push({
      label: "Roberta Base Twitter",
      value: "cardiffnlp/twitter-roberta-base-sentiment-latest",
    });
    modelOptions.push({
      label: "Distilroberta Financial News",
      value: "mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis",
    });
  }

  return (
    <TextField
      label={label}
      select
      value={value}
      onChange={onChange}
      fullWidth
      style={style}
    >
      {acceptNoSelection && (
        <MenuItem value="">
          <em>Any</em>
        </MenuItem>
      )}
      {modelOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ModelSelect;
