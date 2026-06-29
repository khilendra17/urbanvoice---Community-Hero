import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  lat: number;
  lng: number;
  onLocationChange?: (lat: number, lng: number) => void;
}

function LocationMarker({
  lat,
  lng,
  onLocationChange,
}: MapComponentProps) {
  const [position, setPosition] = useState({ lat, lng });

  useMapEvents({
    click(e) {
      const newPos = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      setPosition(newPos);

      if (onLocationChange) {
        onLocationChange(newPos.lat, newPos.lng);
      }
    },
  });

  return <Marker position={position} />;
}

export default function MapComponent({
  lat,
  lng,
  onLocationChange,
  
}: MapComponentProps) {
    console.log("Map:", lat, lng);
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        lat={lat}
        lng={lng}
        onLocationChange={onLocationChange}
      />
    </MapContainer>
  );
}