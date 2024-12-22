import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { useCallback, useMemo } from "react";
import { Tenant } from "../models/tenant";
import {FirebaseError} from "@firebase/app";

export default function useTenants() {
  const [tenants] = useCollectionOnce(
    query(collection(firebaseFirestore, "tenants"), orderBy("name"))
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

  const deleteTenant = useCallback(async (id: string) => {
    await deleteDoc(doc(firebaseFirestore, "tenants/" + id));
  }, []);

  const updateTenant = useCallback(
    async (id: string, tenant: Tenant, merge = false) => {
      await setDoc(doc(firebaseFirestore, "tenants/" + id), tenant, {
        merge: merge,
      });
    },
    []
  );

  const addTenant = useCallback(async (id: string, tenant: Tenant) => {
    const existingDocRef = await getDoc(
      doc(firebaseFirestore, "tenants/" + id)
    );
    if (existingDocRef.exists()) {
      throw new FirebaseError("duplicate", "firestore/duplicate");
    }
    await setDoc(doc(firebaseFirestore, "tenants/" + id), tenant);
  }, []);

  const existsById = useCallback(async (id: string) => {
    const existingDocRef = await getDoc(
      doc(firebaseFirestore, "tenants/" + id)
    );
    return existingDocRef.exists();
  }, []);

  return {
    tenants: mappedTenants,
    deleteTenant,
    updateTenant,
    addTenant,
    existsById,
  };
}
