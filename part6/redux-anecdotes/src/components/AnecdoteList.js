import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {
    const filter = useSelector(state => state.filter)
    const anecdotes = useSelector(state => state.anecdotes.filter(anecdote => anecdote.content.includes(filter)))
    const dispatch = useDispatch()

    const vote = ({id, content}) => {
        dispatch(voteAnecdote(id))
        dispatch(setNotification(`you voted '${content}'`))
        setTimeout(() => {
          dispatch(removeNotification())
        }, 5000)
    }

    return  anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )
}


export default AnecdoteList