import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap , Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Arrow from "./assets/icon-arrow.svg";
import Icon from "./Icon";



function App() {
  const {address, setAddress} = useState(null)
  const [ipAddress, setIpAddress] = useState("")

  useEffect(() => { 
    try{
      const getInitialData = async () => {
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.API_KEY}&ipAddress=192.212.174.101`)
        const data = await res.json()
        setAddress(data)
      
      }
      getInitialData()
    }
    catch(err){
      console.log(err)
    }
  }, [])
  return (
    <>
      <section>
        <div className="background"></div>
        <article className="form-holder">
          <h1>IP Address Tracker</h1>
          <form action="">
            <input
              type="text"
              placeholder="Search for any IP address"
            />
            <button type="submit">
              <img src={Arrow} className="arrow" alt="" />
            </button>
            <article>
              <h2>IP Address</h2>
              <h1>192.212.174.101</h1>
              <h2>Location</h2>
              <h1>Brooklyn,NY 10001</h1>
              <h2>Timezone</h2>
              <h1>UTC-05:00</h1>
              <h2>ISP</h2>
              <h1>SpaceX Starlink</h1>
            </article>
          </form>
        </article>
        <div className="map">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%",zIndex:0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={Icon} position={[51.505, -0.09]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>
    </>
  );
}

export default App;
