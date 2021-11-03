require('dotenv').config() // importamos dotenv y ejecutamos metodo
require('./mongo.js') // se puede importar directamente debio a que se ejecuta y se cachea no hace falta funcion
const express = require('express')
const cors = require('cors')
const app = express()
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
app.use(cors())
app.use(express.json())
app.use('/cosas', express.static(__dirname)) // __dirname es una env que indica la ruta absoluta que contiene el archivo que se esta ejecutando
const path = require('path')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'))
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(handleErrors)
app.use(notFound)
const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})

module.exports = { app, server }
