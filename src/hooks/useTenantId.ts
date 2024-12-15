import { useMemo } from "react";
import { useParams } from "react-router";

export default function useTenantId() {
  const params = useParams();
  
  const tenantId = useMemo(() => {
    if (!params) {
      return undefined;
    }
    if (!params.tenantId) {
      return undefined;
    }
    return params.tenantId as string;
  }, [params]);

  return tenantId;
}