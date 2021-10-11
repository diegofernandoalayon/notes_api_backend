const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const path = require('path')
let notes = [
  {
    userId: 1,
    id: 1,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
  },
  {
    userId: 1,
    id: 2,
    title: 'qui est esse',
    body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla'
  },
  {
    userId: 1,
    id: 3,
    title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut'
  }
]

// const app = http.createServer((request, response) => {
//     response.writeHead(200,{'Content-Type':'application/json'})
//     response.end(JSON.stringify(notes))
// })
app.get('/', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'index.html'))
})
app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  // response.json(notes)
})
app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.title) {
    return response.status(400).json({ error: 'note.content is missing' })
  }
  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)
  const newNote = {
    userId: 1,
    id: maxId + 1,
    title: note.title,
    body: note.body
  }
  notes = [...notes, newNote]

  response.status(201).json(newNote)
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
