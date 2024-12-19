import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router";
import Header from "./components/Header";
import useTenant from "./hooks/useTenant";

function App() {
  const {tenant} = useTenant();
  return (
    <Stack sx={{ height: "100%" }}>
      <Header tenant={tenant} />
      <Box sx={{ flex: "auto", minHeight: 0, overflow: "auto" }}>
        <Outlet context={{
          tenant: tenant
        }} />
      </Box>
    </Stack>
  );
}

export default App;
