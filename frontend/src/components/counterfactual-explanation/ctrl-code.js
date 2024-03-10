import React from "react";
import { Grid, Select, MenuItem, InputLabel } from "@mui/material";

function CtrlCodes({ ctrlCodes, handleCtrlCodes }) {
  return (
    <Grid>
      <InputLabel
        id="example-label"
        style={{ fontSize: "12px", textAlign: "left" }}
      >
        Generation paradigm
      </InputLabel>
      <Select
        value={ctrlCodes}
        onChange={handleCtrlCodes}
        sx={{ width: 160, height: 30 }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="lexical">lexical</MenuItem>
        <MenuItem value="negation">negation</MenuItem>
        <MenuItem value="insert">insert</MenuItem>
        <MenuItem value="delete">delete</MenuItem>
      </Select>
    </Grid>
  );
}

export default CtrlCodes;
