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

const Statistics = (props) => {
  if (props.good || props.neutral || props.bad < 0) {
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text="good" value={props.good}/>
            <StatisticLine text="neutral" value={props.neutral}/>
            <StatisticLine text="bad" value={props.bad}/>
            <StatisticLine text="total" value={props.total}/>
            <StatisticLine text="average" value={props.average}/>
            <StatisticLine text="positive" value={`${props.positive} %`}/>
          </tbody>
        </table>
     </div>
    )
  }
  return (
    <div>No feedback given</div>
  )
}

// https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics
const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
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
  const [total, setTotal] = useState(0)

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
  const average = total > 0 ? (good - bad) / total : 0
  const positive = total > 0 ? (good / total) * 100 : 0

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    //console.log(good)
    setTotal(updatedGood + neutral + bad)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    //console.log(neutral)
    setTotal(good + updatedNeutral + bad)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    //console.log(bad)
    setTotal(good + neutral + updatedBad)
  }

  return (
    <div>
      <Header header={headers.feedback}/>

      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>

      <Header header={headers.stats}/>

      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive}/>
    </div>
  )
}

export default App