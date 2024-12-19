import { Icon, LatLngExpression } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, Polygon } from "react-leaflet";
import { Tenant } from "../models/tenant";
import { useOutletContext } from "react-router";

interface MapControlProps {
  center: LatLngExpression;
}

export function MapControl({ center }: MapControlProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center);
  }, [center, map]);
  return null;
}

export default function TenantHome() {
  const [center, setCenter] = useState<LatLngExpression>([45.943161, 24.96676]);

  const {tenant}: {tenant?: Tenant} = useOutletContext();

  const area = useMemo(() => {
    if (!tenant || !tenant.area) {
      return undefined;
    }
    return tenant.area.map(x => ([x.latitude, x.longitude] as LatLngExpression));
  }, [tenant]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        if (p) {
          setCenter([p.coords.latitude, p.coords.longitude]);
        }
      },
      undefined,
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  

  return (
    <MapContainer
      style={{ height: "100%" }}
      center={center}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {area && <Polygon color="rgba(0,0,0,0.5)" fillColor="rgba(179, 56, 56, 0.623)" positions={area} />}

      <Marker
        icon={new Icon({ iconUrl: "/images/marker-icon.png" })}
        position={center}
      >
        <MapControl center={center} />
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      
    </MapContainer>
  );
}
