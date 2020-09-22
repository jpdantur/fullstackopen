const reducer = (state = [], action) => {

  switch (action.type) {
    case 'VOTE':
      return state.map(anecdote => anecdote.id === action.data.id ? {...anecdote, votes: anecdote.votes + 1} : anecdote).sort((a1, a2) => a2.votes - a1.votes)
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INITIALIZE_ANECDOTES':
      return action.data
    default: return state
  }
}

export const voteAnecdote = id => {
  return {
    type: 'VOTE',
    data: { id }
  }
}

export const createAnecdote = anecdote => {
  return {
    type: 'NEW_ANECDOTE',
    data: anecdote
  }
}

export const initializeAnecdotes = anecdotes => {
  return {
    type: 'INITIALIZE_ANECDOTES',
    data: anecdotes
  }
}

export default reducer