const mongoose = require('mongoose')
const supertest = require('supertest')
const { app, server } = require('../index')
const Note = require('../models/Note')

const api = supertest(app)

test('notes are returned as json', async () => { // indicamos que es asincrono y debe esperar
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

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
beforeEach(async () => {
  await Note.deleteMany({}) // borramos todas las notas

  // initialNotes.forEach(elemen => new Note(elemen).save())
  const note1 = new Note(initialNotes[0])
  await note1.save()
  const note2 = new Note(initialNotes[1])
  await note2.save()
  const note3 = new Note(initialNotes[2])
  await note3.save()
})
test('there are two notes', async () => { // indicamos que es asincrono y debe esperar
  const response = await api
    .get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about Bootcamp', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(contents).toContain('Aprendiendo FullStack bootcamp')
})

afterAll(() => { // es un hook que se ejecuta despues de todo
  mongoose.connection.close()
  server.close()
})
