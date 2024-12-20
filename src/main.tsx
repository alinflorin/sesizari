import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route } from "react-router";
import Home from "./routes/Home.tsx";
import NotFound from "./routes/NotFound.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Route element={<App />}>
      <Route path="/" index element={<Home />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  </BrowserRouter>
);
