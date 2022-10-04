
import { useState } from 'react'

const Button = ({text, onClick}) => {
  return  (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  )
}

const Statistics = ({good, bad, neutral}) => {
  
    return (
      <>  
        <StatisticLine value= {good} text='good' />   
        <StatisticLine value= {neutral} text='neutral' />   
        <StatisticLine value= {bad} text='bad' />   
        <StatisticLine value= {bad+good+neutral} text='All' />   
        <StatisticLine value= {(bad+good+neutral) / 3} text='Average' />   
        <StatisticLine value= {good / (bad+good+neutral) *100} text='Positive' percentSign='%' />
      </>
    )

  
}

const StatisticLine = ({text, value, percentSign}) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value} {percentSign} </td>
      </tr>      
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => {
    setGood(good + 1);
  }
  const handleClickNeutral = () => {
    setNeutral(neutral + 1);
  }
  const handleClickBad = () => {
    setBad(bad + 1);
  }
  
    return (
      <div>
        <h1>give feedback</h1>
        <Button text='good' onClick={handleClickGood} />
        <Button text='neutral' onClick={handleClickNeutral} />
        <Button text='bad' onClick={handleClickBad} />
        <h1>statics</h1>    
        {
          (good+bad+neutral) > 0 ? 
            <Statistics good={good} bad={bad} neutral={neutral} /> :
            <p>No feedback given</p>            
        }    
      </div>
    )
}
  

export default App