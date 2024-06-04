// import React, { useState } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import L from "leaflet";

// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import { createControlComponent } from "@react-leaflet/core";
// import { useMap } from "react-leaflet/hooks";
// const RouteFinder = () => {
//   const [startPoint, setStartPoint] = useState([0, 0]);
//   const [endPoint, setEndPoint] = useState([0, 0]);
//   const [distance, setDistance] = useState(0);

//   const handleStartPointChange = (event) => {
//     setStartPoint([event.target.value, startPoint[1]]);
//   };

//   const handleEndPointChange = (event) => {
//     setEndPoint([event.target.value, endPoint[1]]);
//   };

//   const handleDistanceChange = (event) => {
//     setDistance(event.target.value);
//   };

//   const createRoutingMachine = (props) => {
//     const map = useMap();

//     const instance = L.Routing.control({
//       waypoints: [L.latLng(startPoint[0], startPoint[1]), L.latLng(endPoint[0], endPoint[1])],
//       lineOptions: {
//         styles: [{ color: "#6FA1EC", weight: 4 }],
//       },
//       show: false,
//       addWaypoints: false,
//       routeWhileDragging: true,
//       draggableWaypoints: true,
//       fitSelectedRoutes: true,
//       showAlternatives: false,
//     }).addTo(map);

//     return instance.getPlan();
//   };

//   const RoutingMachine = createControlComponent(createRoutingMachine);

//   return (
//     <MapContainer center={[0, 0]} zoom={13}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
//       <RoutingMachine />
//       <input type="number" value={startPoint[0]} onChange={handleStartPointChange} placeholder="Enter start latitude" />
//       <input type="number" value={endPoint[0]} onChange={handleEndPointChange} placeholder="Enter end latitude" />
//       <input type="number" value={distance} onChange={handleDistanceChange} placeholder="Enter distance in meters" />
//     </MapContainer>
//   );
// };

// export default RouteFinder;

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Map() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const startLocation = params.get("start");
    const distance = params.get("distance");

    // Use the startLocation and distance to calculate the route
    // and render it on the map using the mapping library
  }, [location]);

  return <div id="map"></div>;
}
