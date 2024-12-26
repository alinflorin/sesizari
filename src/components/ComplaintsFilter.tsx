import { GetComplaintsFilter } from "../hooks/useComplaints";

export interface ComplaintsFilterProps {
  filter: GetComplaintsFilter;
  onChange: (f: GetComplaintsFilter) => void;
}

export default function ComplaintsFilter(props: ComplaintsFilterProps) {
  console.log(props);
  return <div>asdasd</div>
}