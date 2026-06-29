import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
}

export default function GoogleMap({
  lat,
  lng,
  zoom = 15,
  className = "",
}: GoogleMapProps) {
  return (
    <div className={className}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={zoom}
          mapId="urbanvoice-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: "100%", height: "100%" }}
        >
          <AdvancedMarker position={{ lat, lng }} />
        </Map>
      </APIProvider>
    </div>
  );
}