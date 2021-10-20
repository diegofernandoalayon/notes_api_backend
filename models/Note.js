const mongoose = require('mongoose')
const noteSchema = new mongoose.Schema({ // esquema para los datos
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema) //

module.exports = Note

// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

// const note = new Note({
//   content: 'Hola mundillo vidilla',
//   date: new Date(),
//   important: false
// })
// note.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => console.error(err))