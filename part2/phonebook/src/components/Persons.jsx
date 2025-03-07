import React from 'react'

const Persons = ({persons, removePerson}) => {
  return (
    persons.map(person =>
      <p key={person.name}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id)}>
          delete
        </button>
      </p>
    )
  )
}

export default Persons