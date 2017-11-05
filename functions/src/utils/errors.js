import { curry } from 'ramda'

export const errorHandler = curry((handler, req, res) => {
  handler(req, res).catch(error => {
    console.error(error)
    res.status(500).send('Unexpected error')
  })
})
