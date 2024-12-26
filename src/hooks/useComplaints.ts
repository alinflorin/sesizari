import { useCallback } from "react";
import { Complaint } from "../models/complaint";
import { addDoc, collection, getDocs, query, QueryConstraint, serverTimestamp, Timestamp, where } from "firebase/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { ComplaintStatus } from "../models/complaint-status";

export interface GetComplaintsFilter {
  categories?: string[];
  startDate?: Date;
  endDate?: Date;
  statuses?: ComplaintStatus[];
}

export default function useComplaints() {
  const addComplaint = useCallback(async (c: Complaint) => {
    const docRef = await addDoc(collection(firebaseFirestore, "complaints"), {...c, submissionDate: serverTimestamp()});
    return {...c, id: docRef.id} as Complaint;
  }, []);

  const getComplaints = useCallback(async (filter?: GetComplaintsFilter) => {
    const qc: QueryConstraint[] = [];
    if (filter) {
      if (filter.categories && filter.categories.length > 0) {
        qc.push(where("category", "in", filter.categories));
      }
      if (filter.statuses && filter.statuses.length > 0) {
        qc.push(where("status", "in", filter.statuses));
      }
      if (filter.startDate) {
        qc.push(where("submissionDate", ">=", Timestamp.fromMillis(filter.startDate.getTime())));
      }
      if (filter.endDate) {
        qc.push(
          where(
            "submissionDate",
            "<=",
            Timestamp.fromMillis(filter.endDate.getTime())
          )
        );
      }
    }
    const q = query(collection(firebaseFirestore, "complaints"), ...qc);
    
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
