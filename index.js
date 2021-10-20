require('dotenv').config() // importamos dotenv y ejecutamos metodo
require('./mongo.js') // se puede importar directamente debio a que se ejecuta y se cachea no hace falta funcion
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())

const path = require('path')

app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'))
})
app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
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
app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.content) {
    return response.status(400).json({ error: 'note.content is missing' })
  }
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save()
    .then(savedNote => {
      response.json(savedNote)
    })
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
app.use((error, request, response, next) => { // middleware para manejo de errores
  // console.error(error)
  // console.log(error.name)
  if (error.name === 'CastError') {
    response.status(400).end()
  } else {
    response.status(500).end()
  }
})
app.use((request, response) => { // debe ir al final para que no exista problema
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
