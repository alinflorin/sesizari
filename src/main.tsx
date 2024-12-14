import "./fonts";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import Home from "./routes/Home";
import About from "./routes/About";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme} noSsr>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
