import { useState } from 'react'

const PersonForm = ({handleNewPhone, handleNewName, onSubmit, name, phone}) => { 
  return <>
    <form onSubmit={onSubmit}>
      name: <input onChange={handleNewName} value={name} />
      phone: <input onChange={handleNewPhone}  value={phone} />
      <button>add</button>
    </form>
  </>
}

const Persons = ({persons}) => {
  return <>
    <ul>
      {persons.map(person => {
        return <li key={person.name}>{person.name} {person.phone}</li>
      })}
    </ul>  
  </>
}

const App = () => {

  const [persons, setPersons] = useState([
    { 
      name: 'Arto Hellas', 
      phone: '111-111-111'
    }
  ]) 

  const [newEntry, setNewEntry] = useState({name: '', phone: ''}) 

  const handleNewName = (event) => {    
    setNewEntry({
      ...newEntry, 
      name: event.target.value
    });
  }

  const handleNewPhone = (event) => {
    setNewEntry({
      ...newEntry, 
      phone: event.target.value
    }); 
  }
  

  const handleSaveEntry = (event) => {
    event.preventDefault()
    const newPerson = {      
      name: newEntry.name,
      phone: newEntry.phone
    }

    if(!persons.map(person => person.name).includes(newEntry.name)) {
      setPersons(persons.concat(newPerson))
      setNewEntry({
        name: '', 
        phone: ''
      })
    } else {
      alert(`${setNewEntry.name} is already added to phonebook`)
    }    
  }

  return (
    <div>
      <h1>Phonebook</h1>      
      <h2>Add a new</h2>
      <PersonForm handleNewName={handleNewName} handleNewPhone={handleNewPhone} onSubmit={handleSaveEntry} phone= {newEntry.phone} name={newEntry.name} />
      <div>debug newName: {newEntry.name} newPhone {newEntry.phone}</div>            
      <h2>Numbers</h2>
      <Persons persons={persons} />
    </div>
  )
}

export default App