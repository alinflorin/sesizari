import { collection, doc, getDoc, getDocs, query} from "firebase/firestore"
import { db } from "../firebase";
import { Tenant } from "../models/tenant";

export const getAllTenants = async () => {
  const q = query(
    collection(db, "tenants")
  );
  return (await getDocs(q)).docs.map(d => ({...d.data(), id: d.id} as Tenant));
}

export const getTenantById = async (id: string) => {
  const docRef = await getDoc(doc(db, "tenants", id));
  if (!docRef.exists()) {
    return undefined;
  }
  return {...docRef.data(), id: docRef.id} as Tenant;
}