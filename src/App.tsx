import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./styles/App.css";
import "./styles/weather-icons.min.css";
import "./styles/weather-icons-wind.min.css";
import axios from "axios";

const apiKey = "35ea9aa24779e05fcd12b7300dd7e6e3";

function App() {
    // 35ea9aa24779e05fcd12b7300dd7e6e3
    const [position, setPosition] = useState({ lat: null, long: null });

    useEffect(() => {
        getWeather();
    }, [position]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }, []);

    const getWeather = async () => {
        if (!position) {
            return;
        }
        const weather = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${position?.lat}&lon=${position?.long}&exclude=minutely,alerts&appid=${apiKey}&units=metric`
        );
        console.log({ weather });
    };

    function showPosition(position: any) {
        const { latitude, longitude } = position.coords;
        setPosition({ lat: latitude, long: longitude });
    }

    return (
        <div className="App">
            <div className="weather-card">
                <h1>Running Weather</h1>
                <div className="weather-summary">
                    <h3></h3>
                </div>
            </div>
        </div>
    );
}

export default App;
