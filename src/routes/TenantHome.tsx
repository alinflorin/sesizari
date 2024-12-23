import { useOutletContext } from "react-router";
import { Tenant } from "../models/tenant";
import { makeStyles } from "@fluentui/react-components";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import MapToolbar from "../components/MapToolbar";
import { useCallback, useState } from "react";
import { LatLngExpression } from "leaflet";
import AddComplaint from "../components/AddComplaint";
import { Complaint } from "../models/complaint";
import { User } from "../models/user";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default function TenantHome() {
  const classes = useStyles();
  const tenant = useOutletContext<{ tenant: Tenant | undefined }>()?.tenant;
  const user = useOutletContext<{ user: User | undefined }>()?.user;

  const [pickedLocation, setPickedLocation] = useState<
    LatLngExpression | undefined
  >();

  const locationPicked = useCallback((latLng: LatLngExpression) => {
    setPickedLocation(latLng);
  }, []);

  const onAddComplaintClosed = useCallback(
    (complaint?: Complaint | undefined) => {
      console.log(complaint);
      setPickedLocation(undefined);
    },
    []
  );

  return (
    <>
      <div className={classes.container}>
        {tenant && (
          <MapContainer
            className={classes.map}
            center={[tenant.mapCenter.latitude, tenant.mapCenter.longitude]}
            scrollWheelZoom={true}
            bounceAtZoomLimits={true}
            zoom={13}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {tenant.area && (
              <Polygon
                className="areapoly"
                interactive={false}
                positions={tenant.area.map((x) => [x.latitude, x.longitude])}
              />
            )}
            <MapToolbar tenant={tenant} user={user} onLocationPicked={locationPicked} />
          </MapContainer>
        )}
      </div>
      {pickedLocation && user && (
        <AddComplaint
          user={user}
          location={pickedLocation}
          onClose={onAddComplaintClosed}
        />
      )}
    </>
  );
}
