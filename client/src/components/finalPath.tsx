// import { Suspense } from "react";
// import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { GoogleMap, GoogleMapApiLoader, Marker } from "react-google-map-wrapper";

export default function FinalPath(params) {
  const flightPlanCoordinates = [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 },
  ];

  function MyMap() {
    return (
      <GoogleMapApiLoader apiKey="AIzaSyAeXU9ZqzunCegvgOV3iYrvDkUTcPAZnKw">
        <GoogleMap className="h-[400px]" initialZoom={3} initialCenter={{ lat: 0, lng: -180 }}>
          <Polyline path={flightPlanCoordinates} strokeColor="#FF0000" strokeOpacity={1.0} strokeWeight={2} geodesic />
        </GoogleMap>
      </GoogleMapApiLoader>
    );
  }
}
