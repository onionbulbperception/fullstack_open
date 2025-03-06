import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({persons}) => {
  return (
    persons.map(person =>
      <p key={person.name}>{person.name} {person.number}</p>
    )
  )
}

const Filter = ({filter, changeFilterChanges}) => {
  return (
    <form>
      <div>
        filter shown with <input value={filter} onChange={changeFilterChanges}></input>
      </div>
    </form>
  )
}

const PersonForm = ({name, nameHandler, number, numberHandler, addPersonHandler}) => {
  return (
    <form>
      <div>
        name: <input value={name} onChange={nameHandler}/> <br/>
        number: <input value={number} onChange={numberHandler}></input>
      </div>
      <div>
        <button type="submit" onClick={addPersonHandler}>add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    //console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        //console.log('promise fulfilled')
        setPersons(response.data)
      })
    }, [])
    //console.log('render', persons.length, 'notes')

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChanges = (event) => {
    //console.log(event.target.value)
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (persons.find(person => person.name === newName)) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/alert
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }
  
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} changeFilterChanges={handleFilterChanges}/>
      <h3>add a new</h3>
      <PersonForm name={newName} nameHandler={handleNameChange} number={newNumber} 
                  numberHandler={handleNumberChange} addPersonHandler={addPerson}/>
      <h3>Numbers</h3>
      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App