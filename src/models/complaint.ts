import { GeoPoint, Timestamp } from "firebase/firestore";
import { ComplaintStatus } from "./complaint-status";

export interface Complaint {
  id?: string;
  tenantId: string;
  description: string;
  location: GeoPoint;
  regNo?: number;
  category: string;
  authorEmail: string;
  authorName: string;
  status: ComplaintStatus;
  submissionPhotos?: string[];
  resolutionPhotos?: string[];
  submissionDate?: Timestamp;
  lastUpdateAt?: Timestamp;
}
