import React, { useState, useEffect } from "react";
import axios from "axios";

const Find = ({ findTerm, onChange }) => (
  <div>
    find countries
    <input value={findTerm} onChange={onChange} />
  </div>
);

const Country = ({ country }) => {
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
    </div>
  );
};

const Countries = ({ countries, findTerm }) => {
  return (
    <div>
      {countries.length > 1
        ? countries.map((country) => (
            <div key={country.name}>{country.name}</div>
          ))
        : countries.map((country) => (
            <Country key={country.name} country={country} />
          ))}
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [findTerm, setFindTerm] = useState("");

  const handleFindTermChange = (event) => {
    setFindTerm(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(findTerm.toLowerCase())
  );
  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  return (
    <div>
      <Find findTerm={findTerm} onChange={handleFindTermChange} />
      {filteredCountries.length > 10 ? (
        <div>Too many matches, specify another filter</div>
      ) : (
        <Countries countries={filteredCountries} findTerm={findTerm} />
      )}
    </div>
  );
};

export default App;
