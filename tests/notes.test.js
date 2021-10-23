const mongoose = require('mongoose')
const supertest = require('supertest')
const { app, server } = require('../index')

const api = supertest(app)

test('notes are returned as json', async () => { // indicamos que es asincrono y debe esperar
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('there are two notes', async () => { // indicamos que es asincrono y debe esperar
  const response = await api
    .get('/api/notes')
  expect(response.body).toHaveLength(11)
})

afterAll(() => { // es un hook que se ejecuta despues de todo
  mongoose.connection.close()
  server.close()
})
