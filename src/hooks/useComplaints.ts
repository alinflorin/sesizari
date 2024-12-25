import { useCallback } from "react";
import { Complaint } from "../models/complaint";
import { addDoc, collection, getDocs, query, serverTimestamp } from "firebase/firestore";
import { firebaseFirestore } from "../providers/firebase";

export default function useComplaints() {
  const addComplaint = useCallback(async (c: Complaint) => {
    const docRef = await addDoc(collection(firebaseFirestore, "complaints"), {...c, submissionDate: serverTimestamp()});
    return {...c, id: docRef.id} as Complaint;
  }, []);

  const getComplaints = useCallback(async () => {
    const q = query(collection(firebaseFirestore, "complaints"));
    const results = await getDocs(q);
    return results.docs.map(x => {
      return {
        ...x.data(),
        id: x.id
      } as Complaint;
    });
  }, []);

  return { addComplaint, getComplaints };
}
