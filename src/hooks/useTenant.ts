import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import useTenantId from "./useTenantId";
import { doc } from "firebase/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { Tenant } from "../models/tenant";

export default function useTenant() {
  const tenantId = useTenantId();
  const [tenant, tenantLoading] = useDocumentDataOnce(
    doc(firebaseFirestore, "tenants/" + tenantId)
  );
  return {tenant: tenant ? { ...tenant, id: tenantId } as Tenant : undefined, tenantLoading};
}