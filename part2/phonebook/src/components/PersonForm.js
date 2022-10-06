const PersonForm = ({handleNewNumber, handleNewName, onSubmit, name, number}) => { 
  return <>
    <form onSubmit={onSubmit}>
      name: <input onChange={handleNewName} value={name} />
      phone: <input onChange={handleNewNumber}  value={number} />
      <button>add</button>
    </form>
  </>
}

export default PersonForm