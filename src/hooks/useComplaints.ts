import { useCallback } from "react";
import { Complaint } from "../models/complaint";
import {
  addDoc,
  collection,
  doc,
  DocumentSnapshot,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { firebaseFirestore } from "../providers/firebase";
import { GetComplaintsFilter } from "../models/get-complaints-filter";

export default function useComplaints() {
  const addComplaint = useCallback(async (c: Complaint) => {
    const docRef = await addDoc(collection(firebaseFirestore, "complaints"), {
      ...c,
      submissionDate: serverTimestamp(),
    });
    return { ...c, id: docRef.id } as Complaint;
  }, []);

  const getComplaints = useCallback(
    async (tenantId: string, filter?: GetComplaintsFilter) => {
      const qc: QueryConstraint[] = [where("tenantId", "==", tenantId)];
      if (filter) {
        if (filter.categories.length > 0) {
          qc.push(where("category", "in", filter.categories));
        }
        if (filter.statuses.length > 0) {
          qc.push(where("status", "in", filter.statuses));
        }
        if (filter.startDate) {
          qc.push(
            where(
              "submissionDate",
              ">=",
              Timestamp.fromMillis(filter.startDate.getTime())
            )
          );
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
      return results.docs.map((x) => {
        return {
          ...x.data(),
          id: x.id,
        } as Complaint;
      });
    },
    []
  );

  const getComplaintsForAdmin = useCallback(
    async (
      tenantId: string,
      elementsPerPage = 50,
      lastDoc: DocumentSnapshot | undefined = undefined
    ) => {
      const qc: QueryConstraint[] = [
        where("tenantId", "==", tenantId),
        orderBy("submissionDate", "desc"),
      ];

      const fullCount = await getCountFromServer(
        query(collection(firebaseFirestore, "complaints"), ...qc)
      );

      if (lastDoc) {
        qc.push(startAfter(lastDoc));
      }

      qc.push(limit(elementsPerPage));

      const q = query(collection(firebaseFirestore, "complaints"), ...qc);
      const results = await getDocs(q);
      return {
        rightElement:
          results.size < elementsPerPage
            ? undefined
            : (results.docs[results.size - 1] as DocumentSnapshot),
        count: fullCount.data().count,
        data: results.docs.map((x) => {
          return {
            ...x.data(),
            id: x.id,
          } as Complaint;
        }),
      };
    },
    []
  );

  const updateComplaint = useCallback(
    async (id: string, complaint: Partial<Complaint>) => {
      await setDoc(
        doc(firebaseFirestore, "complaints/" + id),
        { ...complaint, lastUpdateAt: serverTimestamp() },
        {
          merge: true,
        }
      );
      const docRef = await getDoc(doc(firebaseFirestore, "complaints/" + id));
      return {...docRef.data(), id: docRef.id} as Complaint;
    },
    []
  );

  return {
    addComplaint,
    getComplaints,
    getComplaintsForAdmin,
    updateComplaint,
  };
}
