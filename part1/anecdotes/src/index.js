import React, { useState } from "react";
import ReactDOM from "react-dom";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;
const Anecdote = ({ selected, votes }) => (
  <>
    <div>{anecdotes[selected]}</div>
    <div>has {votes} votes</div>
  </>
);

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const App = ({ anecdotes }) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const vote = (selected) => {
    const votesCopy = [...votes];
    votesCopy[selected]++;
    setVotes(votesCopy);
  };
  return (
    <div>
      <Anecdote selected={selected} votes={votes[selected]} />
      <Button
        onClick={() => setSelected(getRandomInt(0, anecdotes.length))}
        text="next anecdote"
      />
      <Button onClick={() => vote(selected)} text="vote" />
    </div>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
