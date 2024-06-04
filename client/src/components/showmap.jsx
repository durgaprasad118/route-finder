// import axios from "axios";
// import { useEffect, useState } from "react";

// export default function ShowMap() {
//   const [data, setData] = useState();

//   const init = async () => {
//     try {
//       let response = await axios.get("http://localhost:6111/api/route?place=kolkata&distance=23");
//       setData(response.data);
//       return response.data;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     init();
//     // let config = {
//     //   method: "get",
//     //   maxBodyLength: Infinity,
//     //   url: "http://localhost:6111/api/route?place=kolkata&distance=23",
//     //   headers: {},
//     // };
//     // axios
//     //   .request(config)
//     //   .then((response) => {
//     //     console.log(JSON.stringify(response.data));
//     //     setData(response.data);
//     //   })
//     //   .catch((error) => {
//     //     console.log(error);
//     //   });
//   }, []);
//   return (
//     <div>
//       <h1>Map</h1>
//       <div>{data}</div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";

const Showmap = () => {
  const [place, setplace] = useState("");
  const [distance, setDistance] = useState("");
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchRoute = async () => {
    try {
      const response = await axios.get("http://localhost:6111/api/route", {
        params: {
          place: place,
          distance: distance,
        },
      });
      setRoute(response.data);
      console.log(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching route");
      setRoute(null);
    }
  };

  return (
    <div>
      <h1>Find Random Path</h1>
      <div>
        <label>
          Starting Point:
          <input type="text" value={place} onChange={(e) => setplace(e.target.value)} placeholder="Enter starting point" />
        </label>
      </div>
      <div>
        <label>
          Distance (in km):
          <input type="text" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Enter distance" />
        </label>
      </div>
      <button onClick={handleFetchRoute}>Get Random Path</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {route && (
        <div className="text-black">
          <h2>Route:</h2>
          <pre>{JSON.stringify(route, null, 2)}</pre>
          {console.log(route)}
        </div>
      )}
    </div>
  );
};

export default Showmap;
