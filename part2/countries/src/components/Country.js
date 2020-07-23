import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ weather }) => {
  return (
    <div>
      <h2>Weather in {weather.location.name}</h2>
      <div>
        <b>temperature: </b>
        {weather.current.temperature} Celsius
      </div>
      <img src={weather.current.weather_icons} alt="" />
      <div>
        <b>wind: </b>
        {weather.current.wind_speed} mph direction {weather.current.wind_dir}
      </div>
    </div>
  );
};

const Country = ({ country }) => {
  const [weather, setWeather] = useState("");
  useEffect(() => {
    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${
          process.env.REACT_APP_API_KEY
        }&query=${encodeURIComponent(country.capital.trim())}`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [country]);
  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>languages</h2>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img src={country.flag} alt="" width="100" height="100" />
      {weather === "" ? (
        <div>Loading weather...</div>
      ) : (
        <Weather weather={weather} />
      )}
    </div>
  );
};

export default Country;
