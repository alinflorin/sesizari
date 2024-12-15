import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { Tenant } from "../models/tenant";
import { useCallback } from "react";

export default function useFirestore() {
  const getTenantById = useCallback(async (id: string) => {
    const docRef = await getDoc(doc(db, "tenants", id));
    if (!docRef.exists()) {
      return undefined;
    }
    return { ...docRef.data(), id: docRef.id } as Tenant;
  }, []);

  const getAllTenants = useCallback(async () => {
    const q = query(collection(db, "tenants"));
    return (await getDocs(q)).docs.map(
      (d) => ({ ...d.data(), id: d.id } as Tenant)
    );
  }, []);

  return { getTenantById, getAllTenants };
}
