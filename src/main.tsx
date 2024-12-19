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
import NotFound from "./routes/NotFound";
import Signup from "./routes/Signup";
import ForgotPassword from "./routes/ForgotPassword";
import TenantAdmin from "./routes/TenantAdmin";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme} noSsr>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="t/:tenantId" element={<TenantHome />} />
          <Route path="t/:tenantId/admin" element={<TenantAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
