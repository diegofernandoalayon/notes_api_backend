const mongoose = require('mongoose')

const connectionString = 'mongodb+srv://chanchitoFeliz:LACASA.es98@cluster0.d1br2.mongodb.net/notes-db?retryWrites=true&w=majority'

// conexión a mongodb

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useFindAndModify: false,
  // useCreateIndex: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

const noteSchema = new mongoose.Schema({ // esquema para los datos
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema) //

const note = new Note({
  content: 'Hola mundillo vidilla',
  date: new Date(),
  important: false
})
note.save()
  .then(result => {
    console.log(result)
    mongoose.connection.close()
  })
  .catch(err => console.error(err))
