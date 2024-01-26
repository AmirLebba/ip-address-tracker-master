import { useState, useEffect } from "react";
import { MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Arrow from "./assets/icon-arrow.svg";
import MarkerPosition from "./MarkerPosition";
import validator from "validator";

function App() {
  const [address, setAddress] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;

   const isValidIPAddress = (ip) => {
     return validator.isIP(ip, 4) || validator.isIP(ip, 6);
   };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=192.212.174.101`
        );

        if (!response.ok) {
          // Handle non-successful response
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setAddress(data);
        
      } catch (err) {
        // Handle errors during fetch or processing
        setError(err.message || "Something went wrong");
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  /**/

  const handleSearch = async () => {
    try {

      setLoading(true);

      if (!isValidIPAddress(userInput)) {
        throw new Error("Invalid IP address format");
      }

      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${userInput}`
      );

      if (!response.ok) {
        // Handle non-successful response
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      setAddress(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Something went wrong");
      setAddress(null); // Clear the address if there is an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section>
        <div className="background"></div>
        <article className="form-holder">
          <h1>IP Address Tracker</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              type="text"
              placeholder="Search for any IP address"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              style={{
                borderColor: error
                  ? "red"
                  : isValidIPAddress(userInput)
                  ? "initial"
                  : "red",
              }}
            />
            <button type="submit" onClick={handleSearch}>
              <img src={Arrow} className="arrow" alt="" />
            </button>
            <article>
              <div>
                <h2>IP Address</h2>
                <h1>{address?.ip}</h1>
              </div>
              <div>
                <h2>Location</h2>
                <h1>
                  {address?.location.city}, {address?.location.country}
                </h1>
              </div>
              <div>
                <h2>Timezone</h2>
                <h1>{address?.location.timezone} </h1>
              </div>
              <div>
                <h2>ISP</h2>
                <h1>{address?.isp}</h1>
              </div>
            </article>
          </form>
        </article>
        <div className="map">
          <MapContainer
            center={
              address
                ? [address.location.lat, address.location.lng]
                : [51.505, -0.09]
            }
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {address && <MarkerPosition address={address} />}
          </MapContainer>
        </div>
      </section>
    </>
  );
}

export default App;
