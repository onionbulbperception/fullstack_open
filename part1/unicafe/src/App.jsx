import { useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h2>{props.header}</h2>
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Stats = (props) => {
  return (
    <div>
      <p>
        good {props.good} <br/>
        neutral {props.neutral} <br/>
        bad {props.bad}
      </p>
    </div>
  )
}


const App = () => {
  const headers = {
    feedback: 'give feedback',
    stats: 'statistics',
  }
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    //console.log(good)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    //console.log(neutral)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    //console.log(bad)
  }

  return (
    <div>
      <Header header={headers.feedback}/>

      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>

      <Header header={headers.stats}/>

      <Stats good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App