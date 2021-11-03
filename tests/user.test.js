const bcrypt = require('bcrypt')
const User = require('../models/User')

const { api, getAllUsers } = require('./helpers')

const mongoose = require('mongoose')

const { server } = require('../index')
describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'hola', passwordHash })

    await user.save()
  })
  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getAllUsers()
    const newUser = {
      username: 'dfar',
      name: 'Diego',
      password: 'casa'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getAllUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      username: 'dfar',
      name: 'Diego',
      password: 'holamundo'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  afterAll(() => { // es un hook que se ejecuta despues de todo
    mongoose.connection.close()
    server.close()
  })
})
