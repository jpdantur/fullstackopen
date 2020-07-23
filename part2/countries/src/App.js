import React, { useState, useEffect } from "react";
import axios from "axios";
import Country from "./components/Country";

const Find = ({ findTerm, onChange }) => (
  <div>
    find countries
    <input value={findTerm} onChange={onChange} />
  </div>
);

const Countries = ({ countries, setFindTerm }) => {
  return (
    <div>
      {countries.length > 1 ? (
        countries.map((country) => (
          <div key={country.name}>
            {country.name}
            <button onClick={() => setFindTerm(country.name)}>show</button>
          </div>
        ))
      ) : countries.length === 0 ? (
        <div>Loading country...</div>
      ) : (
        <Country country={countries[0]} />
      )}
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
        <Countries countries={filteredCountries} setFindTerm={setFindTerm} />
      )}
    </div>
  );
};

export default App;
