import { createRoot } from "react-dom/client";
import 'leaflet/dist/leaflet.css';
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./routes/Home.tsx";
import NotFound from "./routes/NotFound.tsx";

import "./providers/i18n";
import Login from "./routes/Login.tsx";
import Register from "./routes/Register.tsx";
import ForgotPassword from "./routes/ForgotPassword.tsx";
import TenantHome from "./routes/TenantHome.tsx";
import About from "./routes/About.tsx";
import SuperAdminRoute from "./components/SuperAdminRoute.tsx";
import TenantsAdmin from "./routes/TenantsAdmin.tsx";
import TenantAdmin from "./routes/TenantAdmin.tsx";
import TenantAdminRoute from "./components/TenantAdminRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<App />}>
        <Route path="/" index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="t/:tenantId" element={<TenantHome />} />
        <Route
          path="t/:tenantId/admin"
          element={
            <TenantAdminRoute>
              <TenantAdmin />
            </TenantAdminRoute>
          }
        />
        <Route
          path="tenants-admin"
          element={
            <SuperAdminRoute>
              <TenantsAdmin />
            </SuperAdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
