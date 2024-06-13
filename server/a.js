const GOOGLE_MAPS_API_KEY = ""
import express from "express";
import { Client } from "@googlemaps/google-maps-services-js";
import cors from "cors";

const app = express();
const client = new Client({});
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/api/route", async (req, res) => {
  const placeName = req.query.place;
  const distanceInKm = parseFloat(req.query.distance);

  if (!placeName || isNaN(distanceInKm)) {
    return res.status(400).json({ error: "Place name and valid distance are required" });
  }

  const distanceInMeters = distanceInKm * 1000;
  const halfDistanceInMeters = distanceInMeters / 2;

  try {
    const geocodeResponse = await client.geocode({
      params: {
        address: placeName,
        key: GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000,
    });

    if (geocodeResponse.data.status !== "OK" || geocodeResponse.data.results.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }

    const startingCoordinates = geocodeResponse.data.results[0].geometry.location;

    const placesResponse = await client.placesNearby({
      params: {
        location: startingCoordinates,
        radius: halfDistanceInMeters,
        key: GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000,
    });

    if (placesResponse.data.status !== "OK" || placesResponse.data.results.length === 0) {
      return res.status(404).json({ error: "No nearby locations found" });
    }

    // Find a valid nearby location that is different from the starting point
    let destinationCoordinates = null;
    for (const place of placesResponse.data.results) {
      const location = place.geometry.location;
      if (location.lat !== startingCoordinates.lat || location.lng !== startingCoordinates.lng) {
        destinationCoordinates = location;
        break;
      }
    }

    if (!destinationCoordinates) {
      return res.status(404).json({ error: "No valid nearby locations found" });
    }

    // Log the first valid destination coordinates
    console.log("First valid destination coordinates:", destinationCoordinates);

    // Generate route from starting point to the first valid destination
    const directionsToDestination = await client.directions({
      params: {
        origin: startingCoordinates,
        destination: destinationCoordinates,
        mode: "walking", // Set mode to walking
        key: GOOGLE_MAPS_API_KEY,
        alternatives: true, // Request alternative routes
      },
      timeout: 1000,
    });

    if (directionsToDestination.data.status !== "OK") {
      return res.status(404).json({ error: "No route found to destination" });
    }

    // Select the first route for going to the destination
    const routeToDestination = directionsToDestination.data.routes[0];

    // Generate route from the first valid destination back to the starting point
    const directionsToStart = await client.directions({
      params: {
        origin: destinationCoordinates,
        destination: startingCoordinates,
        mode: "walking", // Set mode to walking
        key: GOOGLE_MAPS_API_KEY,
        alternatives: true, // Request alternative routes
      },
      timeout: 1000,
    });

    if (directionsToStart.data.status !== "OK") {
      return res.status(404).json({ error: "No route found back to starting point" });
    }

    // Select a different route for coming back to the starting point
    const routeToStart =
      directionsToStart.data.routes.find((route) => {
        return route.overview_polyline.points !== routeToDestination.overview_polyline.points;
      }) || directionsToStart.data.routes[0];

    res.json({
      toDestination: routeToDestination,
      toStart: routeToStart,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

const port = 6111;
app.listen(port, () => console.log(`Server running on port ${port}`));
