import { useEffect, useState } from "react";
import useTenantId from "./useTenantId";
import { Tenant } from "../models/tenant";
import useFirestore from "./useFirestore";

export default function useTenant() {
  const tenantId = useTenantId();
  const [tenant, setTenant] = useState<Tenant | undefined>();
  const [loading, setLoading] = useState(true);
  const { getTenantById } = useFirestore();

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      setTenant(undefined);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const tenant = await getTenantById(tenantId);
        setTenant(tenant);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  return { tenant, loading };
}
