import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Search from './components/Search'
import PersonForm from './components/PersonForm'
import axios from 'axios'

const App = () => {

  console.log('inicio app()')
  const [persons, setPersons] = useState([]) 

  const getData = () => {
    const url='http://localhost:3001/persons/'  
    axios 
      .get(url)
      .then(response => {
        console.log('respuesta fetch')
        console.log(response.data)
        setPersons(response.data)
      })
  }
  useEffect(getData, [])

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

  const createData = (event) => {
    event.preventDefault()
    const newPerson = {      
      name: newEntry.name,
      number: newEntry.number
    }
    
    if(!persons.map(person => person.name).includes(newEntry.name)) {
      axios
      .post('http://localhost:3001/persons/', newPerson)
      .then(response => {
        setPersons(persons.concat(response.data));
        setNewEntry({
          name: '', 
          number: ''
        });
      })
      .catch(error => {
        console.error(`HTTP POST Failed: ${error}`)
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
      <PersonForm handleNewName={handleNewName} handleNewNumber={handleNewNumber} onSubmit={createData} number={newEntry.number} name={newEntry.name} />
      <h2>Numbers</h2>      
      <Persons persons={filteredEntries} /> 
    </div>
  )
}

export default App
