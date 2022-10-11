const Persons = ({persons, handleDeleteEntry}) => {
  return <>
    <ul>
      {
        persons.map(person => <li key={person.name}>{person.name}: {person.number} <button onClick={() => handleDeleteEntry(person.id)}>Delete</button></li>)
      }
    </ul>  
  </>
}

export default Persons
