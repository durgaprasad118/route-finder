import express from "express";
import fetch from "node-fetch";
import loader from "@googlemaps/js-api-loader";

const app = express();
const PORT = 3000;

// Google Maps API Key
const API_KEY = "AIzaSyAeXU9ZqzunCegvgOV3iYrvDkUTcPAZnKw";
const { Loader } = loader;

// Initialize Google Maps API Loader
const Gloader = new Loader({
  apiKey: API_KEY,
  version: "weekly",
  libraries: ["places"],
});

app.get("/generate-route", async (req, res) => {
  const { distance, startPlace } = req.query; // Get the desired distance and starting place from the query parameters

  try {
    // Geocode the starting place to get latitude and longitude
    const startLocation = await geocodePlace(startPlace);

    // Call the route generation function and get the new route data
    const routeData = await generateCircularRoute(parseFloat(distance) * 1000, startLocation); // Convert distance from km to meters

    // Return the route data as the response
    res.json(routeData);
  } catch (error) {
    console.error("Error generating route:", error);
    res.status(500).json({ error: "Failed to generate route" });
  }
});

// Function to geocode a place and get its latitude and longitude
async function geocodePlace(place) {
  const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${API_KEY}`);
  const geocodeData = await geocodeResponse.json();

  if (geocodeData.status === "OK") {
    const { lat, lng } = geocodeData.results[0].geometry.location;
    return { lat, lng };
  } else {
    throw new Error(`Geocoding failed: ${geocodeData.status}`);
  }
}

// Function to generate a circular route based on the desired distance
async function generateCircularRoute(desiredDistance, startLocation) {
  const apiKey = API_KEY;

  // 1. Fetch nearby roads around the starting point
  const nearbyRoadsResponse = await fetch(`https://roads.googleapis.com/v1/nearestRoads?points=${startLocation.lat},${startLocation.lng}&key=${apiKey}`);
  const nearbyRoadsData = await nearbyRoadsResponse.json();

  // 2. Generate an initial route
  const initialRouteResponse = await fetch(
    `https://roads.googleapis.com/v1/snapToRoads?path=${startLocation.lat},${startLocation.lng}|${startLocation.lat + 0.01},${startLocation.lng + 0.01}&interpolate=true&key=${apiKey}`
  );
  const initialRouteData = await initialRouteResponse.json();

  // 3. Optimize the route based on the desired distance
  let optimizedRoute = initialRouteData.snappedPoints.map((point) => ({ lat: point.location.latitude, lng: point.location.longitude }));
  let totalDistance = calculateDistance(optimizedRoute);

  const distanceTolerance = 100; // Adjust the tolerance as needed (in meters)
  const maxIterations = 1000; // Maximum number of iterations to prevent infinite loops
  let iterations = 0;

  while (Math.abs(totalDistance - desiredDistance) > distanceTolerance && iterations < maxIterations) {
    if (totalDistance < desiredDistance) {
      // Extend the route
      const lastPoint = optimizedRoute[optimizedRoute.length - 1];
      const newPoint = getNearbyPoint(lastPoint, nearbyRoadsData.snappedPoints, desiredDistance - totalDistance);
      if (newPoint) {
        optimizedRoute.push(newPoint);
      } else {
        break; // Exit the loop if no suitable point is found
      }
    } else {
      // Shorten the route
      optimizedRoute.pop();
    }
    totalDistance = calculateDistance(optimizedRoute);
    iterations++;
  }

  // Connect the last point back to the starting point
  optimizedRoute.push(startLocation);

  return {
    start_location: startLocation,
    end_location: startLocation,
    distance: totalDistance,
    route: optimizedRoute,
  };
}

// Helper functions
function calculateDistance(route) {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += haversineDistance(route[i], route[i + 1]);
  }
  return totalDistance;
}

function haversineDistance(point1, point2) {
  const R = 6371e3; // Radius of the Earth in meters
  const φ1 = (point1.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (point2.lat * Math.PI) / 180;
  const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Distance in meters
  return d;
}

function getNearbyPoint(point, snappedPoints, remainingDistance) {
  // Find the nearest point that extends the route towards the desired distance
  let minDistance = Infinity;
  let nearestPoint = null;

  for (const snappedPoint of snappedPoints) {
    const distance = haversineDistance(point, snappedPoint.location);
    if (distance < minDistance && distance <= remainingDistance) {
      minDistance = distance;
      nearestPoint = snappedPoint.location;
    }
  }

  return nearestPoint;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// http://localhost:3000/generate-route?distance=258750&startPlace=Kolkat

// const GOOGLE_MAPS_API_KEY = "AIzaSyAeXU9ZqzunCegvgOV3iYrvDkUTcPAZnKw";
// import express from "express";
// import { Client } from "@googlemaps/google-maps-services-js";

// const app = express();
// const client = new Client({});

// app.get("/api/route", async (req, res) => {
//   const placeName = req.query.place;
//   const distanceInKm = parseFloat(req.query.distance);
//   if (!placeName || isNaN(distanceInKm)) {
//     return res.status(400).json({ error: "Place name and valid distance are required" });
//   }

//   const distanceInMeters = distanceInKm * 1000;
//   const halfDistanceInMeters = distanceInMeters / 2;

//   try {
//     const geocodeResponse = await client.geocode({
//       params: {
//         address: placeName,
//         key: GOOGLE_MAPS_API_KEY,
//       },
//       timeout: 1000,
//     });

//     if (geocodeResponse.data.status !== "OK" || geocodeResponse.data.results.length === 0) {
//       return res.status(404).json({ error: "Place not found" });
//     }

//     const startingCoordinates = geocodeResponse.data.results[0].geometry.location;

//     const placesResponse = await client.placesNearby({
//       params: {
//         location: startingCoordinates,
//         radius: halfDistanceInMeters,
//         key: GOOGLE_MAPS_API_KEY,
//       },
//       timeout: 1000,
//     });

//     if (placesResponse.data.status !== "OK" || placesResponse.data.results.length === 0) {
//       return res.status(404).json({ error: "No nearby locations found" });
//     }

//     // Find a valid nearby location that is different from the starting point
//     let destinationCoordinates = null;
//     for (const place of placesResponse.data.results) {
//       const location = place.geometry.location;
//       if (location.lat !== startingCoordinates.lat || location.lng !== startingCoordinates.lng) {
//         destinationCoordinates = location;
//         break;
//       }
//     }

//     if (!destinationCoordinates) {
//       return res.status(404).json({ error: "No valid nearby locations found" });
//     }

//     // Log the first valid destination coordinates
//     console.log("First valid destination coordinates:", destinationCoordinates);

//     // Generate route from starting point to the first valid destination
//     const directionsToDestination = await client.directions({
//       params: {
//         origin: startingCoordinates,
//         destination: destinationCoordinates,
//         mode: "walking", // Set mode to walking
//         key: GOOGLE_MAPS_API_KEY,
//         alternatives: true, // Request alternative routes
//       },
//       timeout: 1000,
//     });

//     if (directionsToDestination.data.status !== "OK") {
//       return res.status(404).json({ error: "No route found to destination" });
//     }

//     // Select the first route for going to the destination
//     const routeToDestination = directionsToDestination.data.routes[0];

//     // Generate route from the first valid destination back to the starting point
//     const directionsToStart = await client.directions({
//       params: {
//         origin: destinationCoordinates,
//         destination: startingCoordinates,
//         mode: "walking", // Set mode to walking
//         key: GOOGLE_MAPS_API_KEY,
//         alternatives: true, // Request alternative routes
//       },
//       timeout: 1000,
//     });

//     if (directionsToStart.data.status !== "OK") {
//       return res.status(404).json({ error: "No route found back to starting point" });
//     }

//     // Select a different route for coming back to the starting point
//     const routeToStart =
//       directionsToStart.data.routes.find((route) => {
//         return route.overview_polyline.points !== routeToDestination.overview_polyline.points;
//       }) || directionsToStart.data.routes[0];

//     res.json({
//       toDestination: routeToDestination,
//       toStart: routeToStart,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

// const port = 6111;
// app.listen(port, () => console.log(`Server running on port ${port}`));

// http://localhost:6111/api/route?place=Hyderabad&distance=30
