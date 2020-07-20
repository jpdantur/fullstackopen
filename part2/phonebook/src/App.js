import React, { useState } from "react";

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
      <Person key={person.name} name={person.name} number={person.number} />
    ))}
  </div>
);

const Person = ({ name, number }) => (
  <div>
    {name} {number}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
      setPersons(persons.concat({ name: newName, number: newNumber }));
    } else {
      window.alert(`${newName} is already added to phonebook`);
    }
    setNewName("");
    setNewNumber("");
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
