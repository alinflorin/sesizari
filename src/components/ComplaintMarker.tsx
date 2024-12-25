import { Add24Filled } from "@fluentui/react-icons";
import EnhancedMarker from "./EnhancedMarker";
import { Complaint } from "../models/complaint";
import { Popup, useMap } from "react-leaflet";
import { Marker } from "leaflet";

export interface ComplaintMarkerProps {
  complaint: Complaint;
}

export default function ComplaintMarker(props: ComplaintMarkerProps) {
  const map = useMap();
  return (
    <EnhancedMarker
      eventHandlers={{
        click: (e) => {
          const marker: Marker = e.target;
          if (marker.isPopupOpen()) {
            map.flyTo(e.latlng);
          }
        },
      }}
      providedIcon={<Add24Filled />}
      position={[
        props.complaint.location.latitude,
        props.complaint.location.longitude,
      ]}
    >
      <Popup offset={[6, -2]}>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </EnhancedMarker>
  );
}
