import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Search from './components/Search'
import PersonForm from './components/PersonForm'
import contactsService from './services/contacts'
import axios from 'axios'

const App = () => {

  console.log('inicio app()');
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    contactsService.getAll()    
      .then(initialContacts => {
        console.log('respuesta fetch')
        console.log(initialContacts)
        setPersons(initialContacts)
      })
      .catch(error => console.error(`HTTP GET Failed: ${error}`))
  }, [])

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
      contactsService.create(newPerson)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact));
          setNewEntry({
            name: '', 
            number: ''
          });
        })
        .catch(error => {
          console.alert(`HTTP POST Failed: ${error}`)
        })
    } else {
      alert(`{newEntry.name} is already added to phonebook`)
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
      filter shown with: <Search onChange={handleSearch} value={search} />
      <h2>Add a new</h2>
      <PersonForm handleNewName={handleNewName} handleNewNumber={handleNewNumber} onSubmit={handleSaveEntry} number={newEntry.number} name={newEntry.name} />
      <h2>Numbers</h2>      
      <Persons persons={filteredEntries} /> 
    </div>
  )
}

export default App
