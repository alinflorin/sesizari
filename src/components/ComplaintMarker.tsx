import EnhancedMarker from "./EnhancedMarker";
import { Complaint } from "../models/complaint";
import { Popup, useMap } from "react-leaflet";
import { Marker } from "leaflet";
import { Location24Filled } from "@fluentui/react-icons";

export interface ComplaintMarkerProps {
  complaint: Complaint;
}

export default function ComplaintMarker(props: ComplaintMarkerProps) {
  const map = useMap();

  return (
    <EnhancedMarker
      riseOnHover={true}
      eventHandlers={{
        click: (e) => {
          const marker: Marker = e.target;
          if (marker.isPopupOpen()) {
            map.flyTo(e.latlng);
          }
        },
      }}
      providedIcon={<Location24Filled />}
      position={[
        props.complaint.location.latitude,
        props.complaint.location.longitude,
      ]}
    >
      <Popup offset={[0, -12]}>
        <span>asdasd</span>
      </Popup>
    </EnhancedMarker>
  );
}
