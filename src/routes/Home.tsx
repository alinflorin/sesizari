import { Icon, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface MapControlProps {
  center: LatLngExpression;
}

export function MapControl({ center }: MapControlProps) {
  const map = useMap();
  map.flyTo(center);
  return null;
}

export default function Home() {
  const [center, setCenter] = useState<LatLngExpression>([45.943161, 24.96676]);

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
