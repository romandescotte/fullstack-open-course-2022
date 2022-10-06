import { useState } from 'react'

const PersonForm = ({onChange, onSubmit, value}) => { 
  return <>
    <form onSubmit={onSubmit}>
      name: <input onChange={onChange} value={value} />
      <button>add</button>
    </form>
  </>
}

const Persons = ({persons}) => {
  return <>
    <ul>
      {persons.map(person => {
        return <li key={person.name}>{person.name}</li>
      })}
    </ul>
  
  </>
}

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 

  const [newName, setNewName] = useState('')

  const handleNewName = (event) => {    
    setNewName(event.target.value);    
  }

  const handleNewPerson = (event) => {
    event.preventDefault()
    const newPerson = {      
      name: newName
    }
    if(!persons.map(person => person.name).includes(newName)) {
      setPersons(persons.concat(newPerson))
      setNewName('')
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    
  }

  return (
    <div>
      <h1>Phonebook</h1>      
      <h2>Add a new</h2>
      <PersonForm onChange={handleNewName} onSubmit={handleNewPerson} value={newName} />
      <div>debug newName: {newName}</div>            
      <h2>Numbers</h2>
      <Persons persons={persons} />
    </div>
  )
}

export default App