import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976D2" },
    secondary: { main: "#455A64" },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
    success: { main: "#2E7D32" },
    warning: { main: "#ED6C02" },
    error: { main: "#D32F2F" },
    info: { main: "#0288D1" }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "Roboto, system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    h1: { fontSize: "2rem", fontWeight: 600, lineHeight: 1.25 },
    h2: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.3 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 }
  },
  components: {
    MuiButton: {
      defaultProps: { variant: "contained" }
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true }
    }
  }
});

export default theme; 