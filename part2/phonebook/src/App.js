import React, { useState, useEffect } from "react";
import axios from "axios";

const Filter = ({ searchTerm, onChange }) => (
  <div>
    filter shown with
    <input value={searchTerm} onChange={onChange} />
  </div>
);

const PersonForm = ({
  name,
  number,
  onNameChange,
  onNumberChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={number} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons }) => (
  <div>
    {persons.map((person) => (
      <Person key={person.id} name={person.name} number={person.number} />
    ))}
  </div>
);

const Person = ({ name, number }) => (
  <div>
    {name} {number}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const personUrl = "http://localhost:3001/persons";

  useEffect(() => {
    axios.get(personUrl).then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleAddPerson = (event) => {
    event.preventDefault();
    if (!persons.some((person) => person.name === newName)) {
      axios
        .post(personUrl, { name: newName, number: newNumber })
        .then((response) => {
          setPersons(
            persons.concat({
              name: response.data.name,
              number: response.data.number,
              id: response.data.id,
            })
          );
          setNewName("");
          setNewNumber("");
        });
    } else {
      window.alert(`${newName} is already added to phonebook`);
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} onChange={handleSearchTermChange} />
      <h3>add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleAddPerson}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons.filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
      />
    </div>
  );
};

export default App;
