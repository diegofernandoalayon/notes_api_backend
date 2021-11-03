require('dotenv').config() // importamos dotenv y ejecutamos metodo
require('./mongo.js') // se puede importar directamente debio a que se ejecuta y se cachea no hace falta funcion
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')
const usersRouter = require('./controllers/users')
app.use(cors())
app.use(express.json())
app.use('/cosas', express.static(__dirname)) // __dirname es una env que indica la ruta absoluta que contiene el archivo que se esta ejecutando

const path = require('path')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')
const User = require('./models/User.js')

app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'))
})
app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  // .then(notes => {
  // })
  response.json(notes)
})
app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    }).catch(err => {
      next(err) // de esta manera pasamos al siguiente middleware para manejar los errores
      // response.status(400).end()
    })
})
app.post('/api/notes', async (request, response, next) => {
  const {
    content,
    important = false,
    userId
  } = request.body
  const user = await User.findById(userId)
  if (!content) {
    return response.status(400).json({ error: 'note.content is missing' })
  }
  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })
  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})
app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  // para actualizar la nota con la nueva info
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})
app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use('/api/users', usersRouter)

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})

module.exports = { app, server }
