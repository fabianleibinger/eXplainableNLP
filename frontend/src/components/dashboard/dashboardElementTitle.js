import React from "react";
import { Typography } from "@mui/material";

export function DashboardElementTitle({ children }) {
  return (
    <Typography
      variant="h4"
      gutterBottom
      mb="20px"
      style={{ textAlign: "left", fontWeight: 700 }}
    >
      {children}
    </Typography>
  );
}

export function DashboardElementSubTitle({ children }) {
  return (
    <Typography
      variant="subtitle1"
      gutterBottom
      mb="20px"
      style={{ textAlign: "left", marginTop: "-20px" }}
    >
      {children}
    </Typography>
  );
}

export default DashboardElementTitle;
