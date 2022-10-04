import { useState } from 'react'

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Votes = ({votes}) => {
  return (
    <p>has {votes} votes</p>
  )
}

const MostVoted = ({anecdote, votes}) => {
  return (
    <>
      <h1>Anecdote with most votes</h1>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(7).fill(0))

  const handleNextAnecdote = () => {
    // console.log(Math.floor(Math.random() * 6));
    setSelected(Math.floor(Math.random() * 7))
  }

  const handleVote = () => {
    const copyVotes = [...votes];
    copyVotes[selected] += 1;
    setVotes(copyVotes);
  }
    
  const indexMostVoted = votes.indexOf(Math.max(...votes));
    
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      <Button text="next anecdote" onClick={handleNextAnecdote}/>
      <Button text="vote" onClick={handleVote}/>
      <Votes votes={votes[selected]}/>
      <MostVoted anecdote={anecdotes[indexMostVoted]} votes={votes[indexMostVoted]}/>
      {console.log(votes)}
    </div>
  )
}

export default App