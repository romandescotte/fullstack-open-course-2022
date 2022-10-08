import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Search from './components/Search'
import PersonForm from './components/PersonForm'
import axios from 'axios'

const App = () => {

  console.log('inicio app()')
  const [persons, setPersons] = useState([]) 

  const hook = () => {
    const url='http://localhost:3001/persons/'  
    axios 
      .get(url)
      .then(response => {
        console.log('respuesta fetch')
        console.log(response.data)
        setPersons(response.data)
      })
  }
  useEffect(hook, [])


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
      filter shown with: <Search onChange={handleSearch} value={search} />
      <h2>Add a new</h2>
      <PersonForm handleNewName={handleNewName} handleNewNumber={handleNewNumber} onSubmit={handleSaveEntry} number={newEntry.number} name={newEntry.name} />
      <h2>Numbers</h2>      
      <Persons persons={filteredEntries} /> 
    </div>
  )
}

export default App