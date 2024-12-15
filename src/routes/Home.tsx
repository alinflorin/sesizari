import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Tenant } from "../models/tenant";
import { getAllTenants } from "../services/tenant.service";
import { useNavigate } from "react-router";

export default function Home() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const tenants = await getAllTenants();
      setTenants(tenants);
    })();
  }, []);

  const goToTenant = useCallback(() => {
    navigate("/t/" + selectedTenantId);
  }, [navigate, selectedTenantId]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem"
      }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "100%"
      }}>
        <FormControl fullWidth>
          <InputLabel id="tenant-label">Tenant</InputLabel>
          <Select
            value={selectedTenantId}
            labelId="tenant-label"
            label="Tenant"
            onChange={(e) => setSelectedTenantId(e.target.value)}
          >
            {tenants.map((t) => (
              <MenuItem value={t.id} key={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button disabled={!selectedTenantId} onClick={goToTenant}>Enter</Button>
      </Box>
    </Box>
  );
}