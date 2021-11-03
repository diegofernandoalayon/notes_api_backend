const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
  {
    content: 'Aprendiendo FullStack bootcamp',
    important: true,
    date: new Date()
  },
  {
    content: 'Hola mundo',
    important: false,
    date: new Date()
  },
  {
    content: 'Casa de todo',
    important: false,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getAllUsers = async () => {
  const usersDBAfter = await User.find({})
  return usersDBAfter.map(user => user.toJSON())
}

module.exports = {
  api,
  getAllContentFromNotes,
  initialNotes,
  getAllUsers
}
