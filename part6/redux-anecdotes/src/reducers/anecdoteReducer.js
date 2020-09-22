import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {

  switch (action.type) {
    case 'VOTE':
      return state.map(anecdote => anecdote.id === action.data.id ? {...anecdote, votes: anecdote.votes + 1} : anecdote).sort((a1, a2) => a2.votes - a1.votes)
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INITIALIZE_ANECDOTES':
      return [...action.data].sort((a1, a2) => a2.votes - a1.votes)
    default: return state
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.addVote(anecdote)
    dispatch({
      type: 'VOTE',
      data: updatedAnecdote
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch ({
      type: 'INITIALIZE_ANECDOTES',
      data: anecdotes
    })
  }
}

export default reducer