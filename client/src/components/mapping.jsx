// // import { APIProvider, Map, Marker, DirectionsRenderer, useMarkerRef, useState } from "@vis.gl/react-google-maps";
// // import { useEffect } from "react";
// // export const Mapping = () => {
// //   const [markerRef] = useMarkerRef();

// //   const [directions, setDirections] = useState(null);

// //   const fetchDirections = async () => {
// //     try {
// //       const response = await fetch(
// //         `https://maps.googleapis.com/maps/api/directions/json?origin=${22.5728724},${88.3639295}&destination=${22.5743495},${88.36287209}&key=`
// //       );
// //       const data = await response.json();
// //       setDirections(data);
// //     } catch (error) {
// //       console.error("Error fetching directions:", error);
// //     }
// //   };
// //   useEffect(() => {
// //     fetchDirections();
// //   }, []);
// //   return (
// //     <div className="">
// //       <APIProvider apiKey="">
// //         <Map className="w-[800px] h-[500px]" defaultCenter={{ lat: 22.978624, lng: 87.747803 }} defaultZoom={10} gestureHandling={"greedy"} disableDefaultUI={true}>
// //           <Marker ref={markerRef} position={{ lat: 22.5728724, lng: 88.3639295 }} />
// //           <Marker ref={markerRef} position={{ lat: 22.5743495, lng: 88.36287209 }} />
// //           {directions && <DirectionsRenderer directions={directions} />}
// //         </Map>
// //       </APIProvider>
// //     </div>
// //   );
// // };

// // // const root = createRoot(document.querySelector("#app"));
// // // root.render(
// // //   <React.StrictMode>
// // //     <Mapping />
// // //   </React.StrictMode>
// // // );
// // import { useState, useEffect } from "react";
// // import { APIProvider, Map, Marker, DirectionsRenderer } from "@vis.gl/react-google-maps";

// // export const Mapping = () => {
// //   const [directions, setDirections] = useState(null);

// //   useEffect(() => {
// //     const fetchDirections = async () => {
// //       try {
// //         const response = await fetch(
// //           `https://maps.googleapis.com/maps/api/directions/json?origin=${22.5728724},${88.3639295}&destination=${22.5743495},${88.36287209}&key=`
// //         );
// //         const data = await response.json();
// //         setDirections(data);
// //       } catch (error) {
// //         console.error("Error fetching directions:", error);
// //       }
// //     };

// //     fetchDirections();
// //   }, []);

// //   return (
// //     <div className="">
// //       <APIProvider apiKey="">
// //         <Map className="w-[800px] h-[500px]" defaultCenter={{ lat: 22.978624, lng: 87.747803 }} defaultZoom={10} gestureHandling={"greedy"} disableDefaultUI={true}>
// //           <Marker position={{ lat: 22.5728724, lng: 88.3639295 }} />
// //           <Marker position={{ lat: 22.5743495, lng: 88.36287209 }} />
// //           {directions && (
// //             <DirectionsRenderer
// //               directions={directions}
// //               options={{
// //                 preserveViewport: true,
// //               }}
// //             />
// //           )}
// //         </Map>
// //       </APIProvider>
// //     </div>
// //   );
// // };
// import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
// // import { useState, useEffect } from "react";
// import { Polyline } from "@react-google-maps/api";

// export const Mapping = () => {
//   // const [directions, setDirections] = useState(null);
//   const flightPlanCoordinates = [
//     { lat: 37.772, lng: -122.214 },
//     { lat: 21.291, lng: -157.821 },
//     { lat: -18.142, lng: 178.431 },
//     { lat: -27.467, lng: 153.027 },
//   ];
//   // useEffect(() => {
//   //   const fetchDirections = async () => {
//   //     try {
//   //       const response = await fetch(
//   //         `https://maps.googleapis.com/maps/api/directions/json?origin=${22.5728724},${88.3639295}&destination=${22.5743495},${88.36287209}&kAIzaSyAeXU9ZqzunCegvgOV3iYrvDkUTcPAZnKwAIzaSyAeXU9ZqzunCegvgOV3iYrvDkUTcPAZnKwAIzaSyAeXU9ZqzunCegvgOV3iYrvDkUTcPAZnKwAIzaSyAeXU9ZqzunCegvgOV3iYrvDkUTcPAZnKwey=`
//   //       );
//   //       const data = await response.json();
//   //       setDirections(data);
//   //       console.log(data);
//   //     } catch (error) {
//   //       console.error("Error fetching directions:", error);
//   //     }
//   //   };

//   //   fetchDirections();
//   // }, []);
//   return (
//     <div className="">
//       <APIProvider apiKey="">
//         <Map className="w-[800px] h-[500px]" defaultCenter={{ lat: 22.978624, lng: 87.747803 }} defaultZoom={10} gestureHandling={"greedy"} disableDefaultUI={true}>
//           <Marker position={{ lat: 22.5728724, lng: 88.3639295 }} />
//           <Marker position={{ lat: 22.5743495, lng: 88.36287209 }} />
//           {/* {directions && directions.routes[0].overview_polyline.points && (
//             // <Polyline
//             //   path={directions.routes[0].overview_polyline.points.split("").map((char) => String.fromCharCode(char.charCodeAt(0) - 63))}
//             //   options={{
//             //     strokeColor: "#FF0000",
//             //     strokeOpacity: 0.8,
//             //     strokeWeight: 4,
//             //   }}
//             // />
//             <Polyline path={flightPlanCoordinates[0]} strokeColor="#FF0000" strokeOpacity={1.0} strokeWeight={2} geodesic />
//           )} */}
//           <Polyline path={flightPlanCoordinates} strokeColor="#FF0000" strokeOpacity={1.0} strokeWeight={2} geodesic />
//         </Map>
//       </APIProvider>
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Polyline } from "@react-google-maps/api";

export const Mapping = () => {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${22.5728724},${88.3639295}&destination=${22.5743495},${88.36287209}&key`);
        const data = await response.json();
        setDirections(data);
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    };

    fetchDirections();
  }, []);

  const renderPolyline = () => {
    if (directions && directions.routes.length > 0) {
      // const path = directions.routes[0].overview_path.map((point) => ({
      //   lat: point.lat(),
      //   lng: point.lng(),
      // }));

      const path = { lat: 37.772, lng: -122.214 };

      return (
        <Polyline
          path={path}
          options={{
            strokeColor: "#0101ef",
            strokeOpacity: 1,
            strokeWeight: 5,
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="">
      <APIProvider apiKey="">
        <Map className="w-[800px] h-[500px]" defaultCenter={{ lat: 22.978624, lng: 87.747803 }} defaultZoom={10} gestureHandling={"greedy"} disableDefaultUI={true}>
          <Marker position={{ lat: 22.5728724, lng: 88.3639295 }} />
          <Marker position={{ lat: 22.5743495, lng: 88.36287209 }} />
          {renderPolyline()}
        </Map>
      </APIProvider>
    </div>
  );
};
