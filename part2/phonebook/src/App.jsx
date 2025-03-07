import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonsForm'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

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

    personService.create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChanges}/>
      <h3>add a new</h3>
      <PersonForm name={newName} nameHandler={handleNameChange} number={newNumber} 
                  numberHandler={handleNumberChange} addPersonHandler={addPerson}/>
      <h3>Numbers</h3>
      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App