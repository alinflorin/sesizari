import { collection, query } from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { useMemo } from "react";
import { Tenant } from "../models/tenant";

export default function useTenants() {
  const [tenants] = useCollectionOnce(
    query(collection(firebaseFirestore, "tenants"))
  );

  const mappedTenants = useMemo(() => {
    return tenants?.docs.map(
      (tenant) =>
        ({
          ...tenant.data(),
          id: tenant.id,
        } as Tenant)
    );
  }, [tenants]);

  return mappedTenants;
}
