import { ComplaintStatus } from "./complaint-status";

export interface GetComplaintsFilter {
  categories: string[];
  startDate?: Date;
  endDate?: Date;
  statuses: ComplaintStatus[];
}