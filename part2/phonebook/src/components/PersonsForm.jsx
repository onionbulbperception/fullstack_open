import React from 'react'

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

export default PersonForm