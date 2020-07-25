import React, { useState, useEffect } from "react";
import Person from "./components/Person";
import Notification from "./components/Notification";
import personService from "./services/persons";

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

const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map((person) => (
      <Person
        key={person.id}
        id={person.id}
        name={person.name}
        number={person.number}
        handleDelete={handleDelete}
      />
    ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((returnedPersons) => setPersons(returnedPersons));
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
  const handleDelete = (id, name) => () => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setSuccessMessage(`Deleted ${name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      });
    }
  };

  const handleAddPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (existingPerson === undefined) {
      personService
        .create({ name: newName, number: newNumber })
        .then((returnedPerson) => {
          setPersons(
            persons.concat({
              name: returnedPerson.name,
              number: returnedPerson.number,
              id: returnedPerson.id,
            })
          );
          setNewName("");
          setNewNumber("");
          setSuccessMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        });
    } else {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(existingPerson.id, {
            id: existingPerson.id,
            name: existingPerson.name,
            number: newNumber,
          })
          .then((updatedPerson) => {
            setNewName("");
            setNewNumber("");
            setPersons(
              persons.map((person) => ({
                id: person.id,
                name: person.name,
                number:
                  person.id === updatedPerson.id
                    ? updatedPerson.number
                    : person.number,
              }))
            );
            setSuccessMessage(`Updated ${updatedPerson.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setNewName("");
            setNewNumber("");
            setErrorMessage(
              `Information of ${newName} has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification status="error" message={errorMessage} />
      <Notification status="success" message={successMessage} />
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
        handleDelete={handleDelete}
        persons={persons.filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
      />
    </div>
  );
};

export default App;
