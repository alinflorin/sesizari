import { useEffect, useState } from "react";
import useTenantId from "./useTenantId";
import { Tenant } from "../models/tenant";
import { getTenantById } from "../services/tenant.service";

export default function useTenant() {
  const tenantId = useTenantId();
  const [tenant, setTenant] = useState<Tenant | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      return;
    }
    (async () => {
      try {
        const tenant = await getTenantById(tenantId);
        setTenant(tenant);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();
  }, [tenantId]);

  return {tenant, loading};
}