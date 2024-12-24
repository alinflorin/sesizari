import { useCallback } from "react";
import { Complaint } from "../models/complaint";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseFirestore } from "../providers/firebase";

export default function useComplaints() {
  const addComplaint = useCallback(async (c: Complaint) => {
    const docRef = await addDoc(collection(firebaseFirestore, "complaints"), {...c, submissionDate: serverTimestamp()});
    return {...c, id: docRef.id} as Complaint;
  }, []);

  return { addComplaint };
}
