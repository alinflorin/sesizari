import { useParams } from "react-router";

export default function useTenantId() {
  const { tenantId } = useParams<{ tenantId: string }>();
  return tenantId;
}