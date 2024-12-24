import { Timestamp } from "firebase/firestore";
import { ComplaintStatus } from "./complaint-status";

export interface Complaint {
  id?: string;
  description: string;
  regNo?: string;
  category: string;
  authorEmail: string;
  authorName: string;
  status: ComplaintStatus;
  submissionPhoto?: string;
  resolutionPhoto?: string;
  submissionDate?: Timestamp;
  lastUpdateAt?: Timestamp;
}
