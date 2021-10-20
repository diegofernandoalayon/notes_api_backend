require('dotenv').config() // importamos dotenv y ejecutamos metodo
require('./mongo.js') // se puede importar directamente debio a que se ejecuta y se cachea no hace falta funcion
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')

app.use(cors())
app.use(express.json())

const path = require('path')
let notes = []

// const app = http.createServer((request, response) => {
//     response.writeHead(200,{'Content-Type':'application/json'})
//     response.end(JSON.stringify(notes))
// })
app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'))
})
app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
})
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  // const note = notes.find((note) => note.id === id)
  Note.findById(id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    }).catch(err => {
      console.error(err)
      response.status(400).end()
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
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
