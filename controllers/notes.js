
const notesRouter = require('express').Router()
// const e = require('express')
// const jwt = require('jsonwebtoken')
const userExtractor = require('../middleware/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
})
notesRouter.get('/:id', (request, response, next) => {
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
notesRouter.post('/', userExtractor, async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body
  // sacar userId de request
  const { userId } = request
  const user = await User.findOne({ userId })
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
notesRouter.put('/:id', userExtractor, (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  // para actualizar la nota con la nueva informacion
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
})
notesRouter.delete('/:id', userExtractor, (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = notesRouter
