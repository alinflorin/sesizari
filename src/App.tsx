import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router";
import Header from "./components/Header";

function App() {
  return (
    <Stack sx={{ height: "100%" }}>
      <Header />
      <Box sx={{flex: 'auto', minHeight: 0, overflow: 'auto'}}>
        <Outlet />
      </Box>
    </Stack>
  );
}

export default App;
