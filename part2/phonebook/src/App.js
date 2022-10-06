import { useState } from 'react'

const Search = ({onChange, value}) => {
  return <>
    <input onChange={onChange} value={value} />
  </>
}

const PersonForm = ({handleNewNumber, handleNewName, onSubmit, name, number}) => { 
  return <>
    <form onSubmit={onSubmit}>
      name: <input onChange={handleNewName} value={name} />
      phone: <input onChange={handleNewNumber}  value={number} />
      <button>add</button>
    </form>
  </>
}

const Persons = ({persons}) => {
  return <>
    <ul>
      {persons.map(person => {
        return <li key={person.name}>{person.name} {person.number}</li>
      })}
    </ul>  
  </>
}

const App = () => {

  const [persons, setPersons] = useState([    
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 

  const [newEntry, setNewEntry] = useState({name: '', number: ''}) 
  const [search, setSearch] = useState('')

  const handleNewName = (event) => {    
    setNewEntry({
      ...newEntry, 
      name: event.target.value
    });
  }

  const handleNewNumber = (event) => {
    setNewEntry({
      ...newEntry, 
      number: event.target.value
    }); 
  }
  

  const handleSaveEntry = (event) => {
    event.preventDefault()
    const newPerson = {      
      name: newEntry.name,
      number: newEntry.number
    }

    if(!persons.map(person => person.name).includes(newEntry.name)) {
      setPersons(persons.concat(newPerson))
      setNewEntry({
        name: '', 
        number: ''
      })
    } else {
      alert(`${newEntry.name} is already added to phonebook`)
    }    
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const filteredEntries = 
    search ? 
    persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())) 
    : persons;

  return (
    <div>
      <h1>Phonebook</h1>      
      <Search onChange={handleSearch} value={search} />
      <h2>Add a new</h2>
      <PersonForm handleNewName={handleNewName} handleNewNumber={handleNewNumber} onSubmit={handleSaveEntry} number={newEntry.number} name={newEntry.name} />
      <h2>Numbers</h2>      
      <Persons persons={filteredEntries} />
    </div>
  )
}

export default App