import { useOutletContext } from "react-router";
import { Tenant } from "../models/tenant";
import { makeStyles } from "@fluentui/react-components";
import { MapContainer, TileLayer } from "react-leaflet";

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
  const tenant = useOutletContext<{ tenant: Tenant }>()?.tenant;
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {tenant && (
        <MapContainer
          className={classes.map}
          center={[tenant.mapCenter.latitude, tenant.mapCenter.longitude]}
          scrollWheelZoom={true}
          bounceAtZoomLimits={true}
          zoom={10}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      )}
    </div>
  );
}
