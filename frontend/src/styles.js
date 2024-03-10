import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
      light: "#63C2FD",
      dark: "#0D47A1",
      contrastText: "#fff",
    },
    secondary: {
      main: "#757575",
      light: "#A4A4A4",
      dark: "#494949",
      contrastText: "#ffffff",
    },
    error: {
      main: "#F44336",
      light: "#FF705A",
      dark: "#E82521",
      contrastText: "#fff",
    },
    warning: {
      main: "#FF9800",
      light: "#FFB74D",
      dark: "#F57C00",
      contrastText: "#fff",
    },
    info: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1976D2",
      contrastText: "#fff",
    },
    success: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#388E3C",
      contrastText: "#fff",
    },
    background: {
      paper: "#fff",
      default: "#fafafa",
      text: "#F7F7F7",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
      disabled: "#BDBDBD",
      hint: "#9E9E9E",
    },
    separation: {
      main: "#E0E0E0",
      light: "#fafafa",
      dark: "#BDBDBD",
      contrastText: "#fff",
    },
    chart: {
      main: "#66CC99",
      light: "#63C2FD",
      dark: "#A0A0A0",
      contrast: "#ff0051",
    },
    normal: {
      main: " #000000",
      contrast: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"],
    h1: {
      fontSize: "2.4rem",
      fontWeight: 500,
      lineHeight: 1.17,
      marginBottom: "1.5rem",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.24,
      marginBottom: "1rem",
    },
    h3: {
      fontSize: "1.6rem",
      fontWeight: 500,
      lineHeight: 1.43,
      marginBottom: "0.75rem",
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 500,
      lineHeight: 1.5,
      marginBottom: "0.5rem",
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.58,
      marginBottom: "0.25rem",
    },
    h6: {
      fontSize: "0.8rem",
      fontWeight: 500,
      lineHeight: 1.67,
      marginBottom: "0.25rem",
    },
    body1: {
      fontSize: "0.9rem",
      fontWeight: 400,
      lineHeight: 1.43,
      marginBottom: "0.25rem",
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.43,
      marginBottom: "0.25rem",
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
        borderRadius: "20px",
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none",
          padding: "1rem 1.5rem",
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        margin: "normal",
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;
