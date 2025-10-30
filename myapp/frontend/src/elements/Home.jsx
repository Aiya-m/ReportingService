import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { Map, Popup, Source, Layer, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";
import Nav from './Admin/Nav'
import { useNavigate } from 'react-router-dom';
import BottomNavbar from "./Local_People/Nav";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import Status from './Status'
import { Flame, Car, Ambulance, Angry, PawPrint, LightbulbOff, DropletOff, HatGlasses } from 'lucide-react';
import { AccountContext } from "./Account";

function Home() {
    const mapRef = React.useRef(null);
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = React.useState(new Date());

    const [cautionLocations, setCautionLocations] = React.useState([]);

    const [viewState, setViewState] = React.useState({
        longitude: -100,
        latitude: 40,
        zoom: 3.5,
    });

    const [userLocation, setUserLocation] = React.useState([viewState.longitude, viewState.latitude]);

    const [circlesData, setCirclesData] = React.useState(null);

    const [insideCircle, setInsideCircle] = React.useState(false);

    const [showPopup, setShowPopup] = React.useState(false);
    const [selectedEmergency, setSelectedEmergency] = React.useState(null);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const { getSession } = useContext(AccountContext)

    useEffect(() => {
        getSession().then((session) => {
            console.log("session: ", session);
            const payload = session.getIdToken().payload;
            setFirstName(payload.given_name)
            setLastName(payload.family_name)
            setPhoneNumber(payload.phone_number)
        })
            .catch((err) => {
                console.log("Failed to get session: ", err)
            });
    }, [getSession]);

    const sendEmergencyReport = async () => {
        try {
            const payload = {
                firstname,
                lastname,
                phone_number,
                latitude: userLocation[1],
                longitude: userLocation[0],
                is_emergency: 1,
                title: selectedEmergency,
                description: selectedEmergency
            };

            const res = await fetch("http://52.87.254.106:3000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                console.log("ส่งเหตุฉุกเฉินเรียบร้อย:", data);
                alert("ส่งเหตุฉุกเฉินเรียบร้อย!");
            } else {
                console.error("เกิดข้อผิดพลาด:", data.message);
                alert("ส่งข้อมูลล้มเหลว: " + data.message);
            }
        } catch (err) {
            console.error("เกิดข้อผิดพลาด:", err);
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
        }
    };

    React.useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timerID);
    }, []);


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

        let watchId;

        const startWatch = (highAccuracy) => {
            console.log(`📍 Starting geolocation (high accuracy: ${highAccuracy})`);

            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([longitude, latitude]);
                    console.log("✅ Location:", { latitude, longitude });

                    if (mapRef.current) {
                        mapRef.current.jumpTo({
                            center: [longitude, latitude],
                            zoom: 16
                        });
                    }
                },
                (error) => {
                    console.error("⚠️ Geolocation watch error:", error);

                    // Fallback if high accuracy caused an issue
                    if (highAccuracy && error.code === error.TIMEOUT) {
                        console.log("⏳ Retrying with enableHighAccuracy: false");
                        navigator.geolocation.clearWatch(watchId);
                        startWatch(false);
                    }
                },
                {
                    enableHighAccuracy: highAccuracy,
                    maximumAge: 10000,
                    timeout: 10000,
                }
            );
        };

        // Start with high accuracy first
        startWatch(true);

        // Cleanup watcher when unmounted
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
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
                    <Status />
                </div>

                <div className="relative h-[525px]">
                    <div className="absolute top-0 left-0 right-0 z-10 text-center py-2 mt-4">
                        <div className="text-center text-gray-700 mt-4 drop-shadow-xl">
                            <p className="text-4xl font-medium"> {currentTime.toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })} น.
                            </p>
                            <p className="text-xl mt-1 text-gray-600"> {currentTime.toLocaleDateString('th-TH', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                            </p>
                        </div>
                    </div>
                    <Map
                        ref={mapRef}
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
                    <button className="bg-blue-600 text-white py-2 rounded-xl shadow-lg" onClick={() => navigate("/report-page")}>แจ้งเหตุ</button>
                    <button className="bg-red-600 text-white py-2 rounded-xl shadow-lg" onClick={() => setShowPopup(true)}>แจ้งเหตุฉุกเฉิน</button>
                </div>
                <div className="absolute bottom-0 w-full flex-shrink-0">
                    <BottomNavbar />
                </div>
                {showPopup && !showConfirm && (
                    <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
                            <h2 className="text-xl font-semibold mb-3">แจ้งเหตุฉุกเฉิน</h2>
                            <div className="flex flex-col justify-center gap-3">
                                {[
                                    { label: "ไฟไหม้", icon: <Flame size={20} /> },
                                    { label: "อุบัติเหตุท้องถนน", icon: <Car size={20} /> },
                                    { label: "บาดเจ็บ/ป่วยฉุกเฉิน", icon: <Ambulance size={20} /> },
                                    { label: "ทะเลาะวิวาท", icon: <Angry size={20} /> },
                                    { label: "สัตว์อันตราย", icon: <PawPrint size={20} /> },
                                    { label: "ไฟดับ", icon: <LightbulbOff size={20} /> },
                                    { label: "น้ำไม่ไหล", icon: <DropletOff size={20} /> },
                                    { label: "โจรกรรม", icon: <HatGlasses size={20} /> },
                                ].map((item, index) => (
                                    <button
                                        key={index}
                                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                        onClick={() => {
                                            setSelectedEmergency(item.label);
                                            setShowConfirm(true); // เปิด Popup ยืนยัน
                                        }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                ))}

                                <button
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                                    onClick={() => setShowPopup(false)}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirm && (
                    <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
                            <h2 className="text-xl font-semibold mb-3">ยืนยันการแจ้งเหตุฉุกเฉิน</h2>
                            <p className="mb-4">คุณต้องการแจ้งเหตุ "{selectedEmergency}" ใช่หรือไม่?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                    onClick={() => {
                                        console.log(`ยืนยันแจ้งเหตุ: ${selectedEmergency}`);
                                        sendEmergencyReport();
                                        setShowConfirm(false);
                                        setShowPopup(false);
                                    }}
                                >
                                    ยืนยัน
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;