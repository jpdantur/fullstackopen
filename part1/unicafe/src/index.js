import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({text}) => (
  <h1>
    {text}
  </h1>
)

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Statistic = ({text, value}) => (
  <div>
    {text} {value}
  </div>
)

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const goodText = "good"
  const neutralText = "neutral"
  const badText = "bad"

  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={() => setGood(good + 1)} text={goodText}/>
      <Button onClick={() => setNeutral(neutral + 1)} text={neutralText}/>
      <Button onClick={() => setBad(bad + 1)} text={badText}/>
      <Header text="statistics"/>
      <Statistic text={goodText} value={good}/>
      <Statistic text={neutralText} value={neutral}/>
      <Statistic text={badText} value={bad}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
