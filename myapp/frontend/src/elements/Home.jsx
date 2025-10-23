import * as React from "react";
import { Map, Popup, Source, Layer, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";

// async function getLocation() {
//     return new Promise((resolve) => {
//         if (!navigator.geolocation) {
//             console.warn("❌ Geolocation not supported. Falling back.");
//             return resolve([-100, 40]);
//         }

//         console.log("📍 Requesting user location...");

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 console.log("✅ Got location:", longitude, latitude);
//                 resolve([longitude, latitude]);
//             },
//             (error) => {
//                 console.error("⚠️ Geolocation error:", error);
//                 resolve([-100, 40]); // fallback
//             },
//             { enableHighAccuracy: true, timeout: 5000 }
//         );
//     });
// }

function Home() {
    const mapRef = React.useRef(null);

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


    //run main function to get userlocation and draw circles around cautionLocations
    // React.useEffect(() => {
    //     if (!navigator.geolocation) {
    //         console.warn("❌ Geolocation not supported");
    //         return;
    //     }

    //     const circles = turf.featureCollection(
    //         cautionLocations.map((loc) => turf.circle(loc, 1, {
    //             steps: 64,
    //             units: "kilometers",
    //         }))
    //     );
    //     setCirclesData(circles);


    //     const watchId = navigator.geolocation.watchPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             console.log("Updated location:", longitude, latitude);

    //             setUserLocation([longitude, latitude]);

    //             // Smoothly move map to new position
    //             if (mapRef.current) {
    //                 mapRef.current.jumpTo({
    //                     center: [longitude, latitude],
    //                     zoom: 16
    //                 });
    //             }
    //         },
    //         (error) => {
    //             console.error("Geolocation watch error:", error);
    //         },
    //         { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    //     );

    //     // 🧹 Cleanup on unmount
    //     return () => {
    //         navigator.geolocation.clearWatch(watchId);
    //     };
    // }, []);


    //     (async () => {
    //         const location = await getLocation();
    //         setPopupLocation(location);

    //         const circles = turf.featureCollection(
    //             locations.map((loc) => turf.circle(loc, 2, { // 2 km radius
    //                 steps: 64,
    //                 units: "kilometers",
    //             }))
    //         );
    //         setCirclesData(circles);

    //         if (mapRef.current) {
    //             console.log("✅ Map is ready, flying to new location...");
    //             mapRef.current.flyTo({ center: location, zoom: 8 });

    //         } else {
    //             console.warn("❌ Map is still null");
    //         }
    //     })();
    // }, []);

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
    );
}

export default Home;