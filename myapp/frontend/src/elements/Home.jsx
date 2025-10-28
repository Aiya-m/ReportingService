import * as React from "react";
import { Map, Popup, Source, Layer, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";
import Nav from './Admin/Nav'
import { useNavigate } from 'react-router-dom';
import BottomNavbar from "./Local_People/Nav";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

function Home() {
    const mapRef = React.useRef(null);
    const navigate = useNavigate();

    const [cautionLocations, setCautionLocations] = React.useState([]);

    const [viewState, setViewState] = React.useState({
        longitude: -100,
        latitude: 40,
        zoom: 3.5,
    });

    const [userLocation, setUserLocation] = React.useState([viewState.longitude, viewState.latitude]);

    const [circlesData, setCirclesData] = React.useState(null);

    const [insideCircle, setInsideCircle] = React.useState(false);


    // fetch to get cautionLocation from server.js
    React.useEffect(() => {
        const fetchCautionLocations = async () => {
            try {
                const res = await fetch("http://localhost:5000/caution_position");
                const data = await res.json();
                setCautionLocations(data.locations);
            } catch (err) {
                console.error("Error fetching caution locations:", err);
            }
        };

        fetchCautionLocations();
    }, []);


    // draw circles base on "cautionLocations"
    React.useEffect(() => {
        if (cautionLocations.length > 0) {
            const circles = turf.featureCollection(
                cautionLocations.map((loc) =>
                    turf.circle(loc, 1, { steps: 64, units: "kilometers" })
                )
            );
            setCirclesData(circles);
        }
    }, [cautionLocations]);


    // watch user location
    React.useEffect(() => {
        if (!navigator.geolocation) {
            console.warn("❌ Geolocation not supported");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([longitude, latitude]);
                console.log([latitude, longitude])

                if (mapRef.current) {
                    mapRef.current.jumpTo({
                        center: [longitude, latitude],
                        zoom: 16
                    });
                }

            },
            (error) => console.error("Geolocation watch error:", error),
            { enableHighAccuracy: false, maximumAge: 10000, timeout: 10000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Check if user in any circles
    React.useEffect(() => {
        if (!userLocation || !circlesData) return;

        const userPoint = turf.point(userLocation);

        const isInside = circlesData.features.some((circle) =>
            turf.booleanPointInPolygon(userPoint, circle)
        );
        setInsideCircle(isInside);
    }, [userLocation, circlesData]);

    return (
        <div className="flex justify-center bg-gray-200 min-h-screen">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg overflow-y-auto max-h-screen">
                <div className="flex items-center bg-orange-500 text-white px-4 py-3">
                    <h1 className="text-lg font-bold">ResQ</h1>
                </div>

                <div className="relative h-[525px]">
                    <Map
                        ref={mapRef} // ✅ this gives direct control
                        initialViewState={{ ...viewState }}
                        onMove={(evt) => setViewState(evt.viewState)}
                        mapStyle="https://tiles.openfreemap.org/styles/liberty"
                        className="w-full h-full rounded-lg shadow-md"
                    >
                        {circlesData && (
                            <Source id="circle" type="geojson" data={circlesData}>
                                <Layer
                                    id="circle-fill"
                                    type="fill"
                                    paint={{
                                        "fill-color": "#f63b3bff",
                                        "fill-opacity": 0.3,
                                    }}
                                />
                                <Layer
                                    id="circle-outline"
                                    type="line"
                                    paint={{
                                        "line-color": "#d81d1dff",
                                        "line-width": 2,
                                    }}
                                />
                            </Source>
                        )}
                        {userLocation && (
                            <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: insideCircle ? "#ff0000" : "#2563eb",
                                        borderRadius: "50%",
                                        border: "2px solid white",
                                        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                                    }}
                                />
                            </Marker>
                        )}

                        {/* <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
                                <h3>You are approximately here!</h3>
                            </Popup> */}
                    </Map>
                </div>
                <div className="flex flex-col gap-4 px-4 py-4 bg-white">
                    <button className="bg-blue-600 text-white py-2 rounded-xl shadow-lg" onClick={() => navigate("/report-page")}>Report</button>
                    <button className="bg-red-600 text-white py-2 rounded-xl shadow-lg" onClick={() => navigate("/report-form-emergency")}>Emergency Report</button>
                </div>
                <div className="absolute bottom-0 w-full flex-shrink-0">
                    <BottomNavbar />
                </div>
            </div>
        </div>
    );
}

export default Home;