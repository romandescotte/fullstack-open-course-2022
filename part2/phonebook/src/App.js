import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Search from './components/Search'
import PersonForm from './components/PersonForm'
import contactsService from './services/contacts'

const App = () => {

  console.log('inicio app()');
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    contactsService.getAll()    
      .then(initialContacts => {
        // console.log('respuesta fetch')
        // console.log(initialContacts)
        setPersons(initialContacts)
      })
      .catch(error => console.error(`HTTP GET Failed: ${error}`))
  }, [])

  const [newEntry, setNewEntry] = useState({name: '', number: ''}) 
  const [search, setSearch] = useState('')

  const handleDeleteEntry = id => {
    const {name} = persons.filter(person => person.id === id)[0]

    const confirmation = window.confirm(`Are you sure you want to delete ${name}?`);

    if(confirmation) {
      deleteEntry()
    }
    const deleteEntry = () => {
      return contactsService.deleteEntry(id)
        .then(response => {
          // console.log(response)
          setPersons(prevState => prevState.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error(`HTTP DELETE Failed: ${error}`);
          alert(
            `the person '${name}' was already deleted from server`
          )
          setPersons(persons.filter(person => person.id !== id))
        });
    }     
    
  }

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
      const person = persons.filter(person => person.name === newEntry.name);
      console.log(person[0].id)
      replaceEntry(person[0].id, newPerson)
    }    
  }

  const replaceEntry = (id, newPerson) => {
    const confirmation = window.confirm(`${newEntry.name} already exists, do you want to replace the number?`)

    if(confirmation) {
      contactsService.updateEntry(id, newPerson)
      .then(returnedPerson => {
        // console.log(returnedPerson)        
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
      })
      .catch(error => {
        console.error(`HTTP PUT Failed: ${error}`);        
      })
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
      <Persons persons={filteredEntries} handleDeleteEntry={handleDeleteEntry} /> 
    </div>
  )
}

export default App
