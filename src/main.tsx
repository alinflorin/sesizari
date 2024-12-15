import "./fonts";
import "leaflet/dist/leaflet.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import Home from "./routes/Home";
import About from "./routes/About";
import Login from "./routes/Login";
import TenantHome from "./routes/TenantHome";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme} noSsr>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="t/:tenantId" element={<TenantHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
