import React, { useEffect, useState } from "react";
import "./styles/App.css";
import "./styles/weather-icons.min.css";
import "./styles/weather-icons-wind.min.css";
import axios from "axios";
import { format } from "date-fns";

const apiKey = "35ea9aa24779e05fcd12b7300dd7e6e3";

function App() {
  const [position, setPosition] = useState({ lat: null, long: null });
  const [currentWeather, setCurrentWeather] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [unit, setUnit] = useState<{ value: number; unit: string }>({
    value: 0,
    unit: "C",
  });

  const getWeatherClothes = ({ temp }: any) => {
    const temperature = temp;
    if (!temperature) {
      return "";
    }
    if (temperature >= 16) {
      return "tank top and shorts";
    }
    if (temperature < 16 && temperature >= 10) {
      return "short sleeve \r tech shirt and shorts";
    }
    if (temperature < 10 && temperature >= 5) {
      return "long sleeve tech shirt shorts or tights, gloves (optional), headband to cover ears (optional)";
    }
    if (temperature < 5 && temperature >= -1) {
      return "long sleeve tech shirt, shorts or tights, gloves, and headband to cover ears";
    }
    if (temperature < -1 && temperature >= -7) {
      return "two shirts layered—a long sleeve tech shirt and a short sleeve tech shirt or long sleeve shirt and jacket—tights, gloves, and headband or hat to cover ears";
    }
    if (temperature < -7 && temperature >= -12) {
      return "two shirts layered, tights, gloves or mittens, headband or hat, and windbreaker jacket/pants";
    }
    if (temperature < -12) {
      return "two shirts layered, tights, windbreaker jacket/pants, mittens, headband or hat, ski mask to cover face";
    }
  };

  useEffect(() => {
    getWeather();
  }, [position]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, (err) => {
        setLocationEnabled(false);
      });
    } else {
      setLocationEnabled(false);
    }
  }, []);

  const getWeather = async () => {
    if (!position || !position.lat || !position.long) {
      return;
    }
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${position?.lat}&lon=${position?.long}&exclude=minutely,alerts&appid=${apiKey}&units=metric`
    );

    setUnit({ value: data?.current?.temp.toFixed(0), unit: "C" });
    setCurrentWeather(data?.current);
    setIsLoading(false);
  };

  function cToF(celsius: number) {
    const cTemp = celsius;
    const cToFahr = (cTemp * 9) / 5 + 32;
    setUnit({ value: cToFahr, unit: "F" });
  }

  function fToC(fahrenheit: number) {
    const fTemp = fahrenheit;
    const fToCel = ((fTemp - 32) * 5) / 9;
    setUnit({ value: fToCel, unit: "C" });
  }

  function convertTemp() {
    if (unit.unit === "F") {
      fToC(unit.value);
    } else {
      cToF(unit.value);
    }
  }

  function showPosition(position: any) {
    const { latitude, longitude } = position.coords;
    setPosition({ lat: latitude, long: longitude });
  }

  if (!locationEnabled) {
    <div className="app">
      <p className="loading-text">
        Browser location feature has not been enabled. Please enable it before
        we can continue
      </p>
    </div>;
  }

  if (isLoading) {
    return (
      <div className="app">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="weather-card">
        <p className="weather-card--date">{format(new Date(), "PPP")}</p>
        {currentWeather.weather && (
          <h1 className="weather-card--weather-description">
            {currentWeather.weather[0].main}
            <img
              alt="weather icon"
              src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon.replace(
                "n",
                "d"
              )}.png`}
            />
          </h1>
        )}
        <div
          className="card-temperature-container"
          onClick={() => convertTemp()}
        >
          <h3>
            {unit.value} {unit.unit}
          </h3>
        </div>
        <div className="card-clothing-recommendation">
          <h2>What to wear?</h2>
          <h3>{getWeatherClothes(currentWeather)}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
