




```js


import express from 'express'
import axios from 'axios'

const app = express()

app.get('/route', async (req, res) => {
  const { startingPoint, distance } = req.query
  if (!startingPoint || !distance) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }
  const distanceInMeters = parseFloat(distance) * 1000
  const halfDistance = distanceInMeters / 2

  try {
    // Step 1: Find a midpoint destination
    const initialUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${startingPoint}&destination=${startingPoint}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`
    console.log(`Initial URL: ${initialUrl}`)
    const response = await axios.get(initialUrl)

    const { routes } = response.data
    if (!routes.length) {
      return res.status(400).json({ error: 'No routes found' })
    }

    const { legs } = routes[0]
    const { steps } = legs[0]

    if (steps.length === 0) {
      return res.status(400).json({ error: 'No steps found in the route' })
    }

    let currentDistance = 0
    let midpoint = null

    // Find the midpoint along the route
    for (let i = 0; i < steps.length; i++) {
      currentDistance += steps[i].distance.value
      if (currentDistance >= halfDistance) {
        midpoint = steps[i].end_location
        break
      }
    }

    if (!midpoint) {
      return res.status(400).json({
        error: 'Could not find a midpoint within the specified distance',
      })
    }

    // Step 2: Create a round trip using the midpoint
    const roundTripUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${startingPoint}&destination=${startingPoint}&waypoints=${midpoint.lat},${midpoint.lng}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`
    console.log(`Round Trip URL: ${roundTripUrl}`)
    const roundTripResponse = await axios.get(roundTripUrl)

    const roundTripRoutes = roundTripResponse.data.routes
    if (!roundTripRoutes.length) {
      return res.status(400).json({ error: 'No round trip routes found' })
    }

    const roundTripLegs = roundTripRoutes[0].legs
    const roundTripSteps = roundTripLegs.flatMap((leg) => leg.steps)

    const routeDistance = roundTripSteps.reduce(
      (acc, step) => acc + step.distance.value,
      0,
    )

    const route = {
      startingPoint,
      distance: routeDistance,
      steps: roundTripSteps.map((step) => ({
        polyline: step.polyline.points,
        distance: step.distance.value,
        duration: step.duration.value,
        instruction: step.html_instructions,
      })),
    }

    res.json(route)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while generating the route' })
  }
})

app.listen(8001, () => {
  console.log(`Server is running on port 8001`)
})

```
