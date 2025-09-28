import * as React from "react";
import { Map, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

async function getLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn("❌ Geolocation not supported. Falling back.");
            return resolve([-100, 40]);
        }

        console.log("📍 Requesting user location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("✅ Got location:", longitude, latitude);
                resolve([longitude, latitude]);
            },
            (error) => {
                console.error("⚠️ Geolocation error:", error);
                resolve([-100, 40]); // fallback
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    });
}

function Home() {
    const mapRef = React.useRef(null);

    const [viewState, setViewState] = React.useState({
        longitude: -100,
        latitude: 40,
        zoom: 3.5,
    });

    const [popupLocation, setPopupLocation] = React.useState([
        viewState.longitude,
        viewState.latitude,
    ]);

    React.useEffect(() => {
        (async () => {
            const location = await getLocation();
            setPopupLocation(location);

            if (mapRef.current) {
                console.log("✅ Map is ready, flying to new location...");
                mapRef.current.flyTo({ center: location, zoom: 8 });
            } else {
                console.warn("❌ Map is still null");
            }
        })();
    }, []);

    return (
        <div>
            This is Home.
            <Map
                ref={mapRef} // ✅ this gives direct control
                initialViewState={{ ...viewState }}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="https://tiles.openfreemap.org/styles/liberty"
                style={{ width: 600, height: 400 }}
            >
                <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
                    <h3>You are approximately here!</h3>
                </Popup>
            </Map>
        </div>
    );
}

export default Home;