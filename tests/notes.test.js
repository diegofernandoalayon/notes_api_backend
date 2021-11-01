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

  // paralell
  // const notesObjects = initialNotes.map(note => new Note(note))
  // const promises = notesObjects.map(note => note.save())
  // await Promise.all(promises)

  // sequential
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
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

test('a note can be deleted', async () => {
  const { response: firstResponse } = await getAllContentFromNotes()
  const { body: notes } = firstResponse
  const [noteToDelete] = notes

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const { contents, response: secondResponse } = await getAllContentFromNotes()
  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be deleted', async () => {
  await api
    .delete('/api/notes/1234')
    .expect(400)

  const { response } = await getAllContentFromNotes()
  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => { // es un hook que se ejecuta despues de todo
  mongoose.connection.close()
  server.close()
})
