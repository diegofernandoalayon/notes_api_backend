const mongoose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')

const { initialNotes, api, getAllContentFromNotes } = require('./helpers')

test('notes are returned as json', async () => { // indicamos que es asincrono y debe esperar
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

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
  const { response } = await getAllContentFromNotes()
  // const response = await api
  //   .get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about Bootcamp', async () => {
  const { contents } = await getAllContentFromNotes()
  expect(contents).toContain('Aprendiendo FullStack bootcamp')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Proximamente async/await',
    important: true
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const { response, contents } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }
  await api.post('/api/notes').send(newNote).expect(400)

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})
afterAll(() => { // es un hook que se ejecuta despues de todo
  mongoose.connection.close()
  server.close()
})
