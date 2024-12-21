import { useOutletContext } from "react-router";
import { Tenant } from "../models/tenant";

export default function TenantHome() {
  const tenant = useOutletContext<{tenant: Tenant}>()?.tenant;
  return <>{tenant?.name}</>;
}
