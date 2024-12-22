import { GeoPoint } from "firebase/firestore";

export interface Tenant {
  id?: string;
  name: string;
  admins: string[];
  categories: string[];
  area?: GeoPoint[];
  mapCenter: GeoPoint;
}
