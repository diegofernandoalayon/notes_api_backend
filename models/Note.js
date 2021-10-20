const mongoose = require('mongoose')
const noteSchema = new mongoose.Schema({ // esquema para los datos
  content: String,
  date: Date,
  important: Boolean
})
noteSchema.set('toJSON', { // para cambiar la forma en que se realiza el toJSON de la respuesta
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
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
