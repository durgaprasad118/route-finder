// import { useState, useEffect, useRef } from "react";
// import { useJsApiLoader } from "@react-google-maps/api";
// import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
// import Autocomplete from "@react-google-maps/api";

// export const GetPath = () => {
//   const [map, setMap] = useState(null);
//   const [directionsResponse, setDirectionsResponse] = useState(null);
//   const originRef = useRef();
//   const destinationRef = useRef();

//   useEffect(() => {
//     const directionsService = new google.maps.DirectionsService();
//     const request = {
//       origin: originRef.current.getPlace().place_id,
//       destination: destinationRef.current.getPlace().place_id,
//       travelMode: google.maps.TravelMode.DRIVING,
//     };
//     directionsService.route(request, (response, status) => {
//       if (status === "OK") {
//         setDirectionsResponse(response);
//       }
//     });
//   }, [originRef, destinationRef]);

//   return (
//     <div>
//       <GoogleMap
//         center={{ lat: 0, lng: 0 }}
//         zoom={5}
//         mapContainerStyle={{ width: "100%", height: "100vh" }}
//         options={{
//           zoomControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//         }}
//         onLoad={(map) => setMap(map)}
//       >
//         <Autocomplete
//           ref={originRef}
//           options={[]}
//           onPlaceSelected={(place) => {
//             // Handle origin selection
//           }}
//         />
//         <Autocomplete
//           ref={destinationRef}
//           options={[]}
//           onPlaceSelected={(place) => {
//             // Handle destination selection
//           }}
//         />
//         {directionsResponse && (
//           <DirectionsRenderer
//             directions={directionsResponse}
//             options={{
//               preserveViewport: true,
//               suppressMarkers: true,
//             }}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";

export const MapWithPolyline = ({ pathCoordinates }) => {
  const mapContainerStyle = {
    height: "400px",
    width: "800px",
  };

  const center = {
    lat: pathCoordinates[0].lat,
    lng: pathCoordinates[0].lng,
  };

  return (
    <LoadScript googleMapsApiKey="">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: "#aaff00",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export const GetPath = () => {
  const pathCoordinates = [
    { lat: 22.5743495, lng: 88.36287209999999 },
    { lat: 19.07609, lng: 72.877426 },
  ];

  return (
    <div>
      <h1>Map with Polyline</h1>
      <MapWithPolyline pathCoordinates={pathCoordinates} />
    </div>
  );
};
