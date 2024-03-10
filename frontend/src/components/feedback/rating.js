import React, { useState } from "react";
import { Rating, Stack, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

function CustomRating({ value, precision, onChange, showLabel, direction }) {
  const [hover, setHover] = useState(-1);
  const labels = {
    1: "Useless",
    2: "Poor",
    3: "Ok",
    4: "Good",
    5: "Excellent",
  };

  return (
    <Stack direction={direction}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={precision}
        onChange={onChange}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {showLabel && value !== null && (
        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </Stack>
  );
}

export default CustomRating;
