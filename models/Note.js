const mongoose = require('mongoose')
// require('../mongo')
const noteSchema = new mongoose.Schema({ // esquema para los datos
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId, // para asignar una relacion entre notas y usuarios
    ref: 'User' // referencia al modelo de User
  }
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

// const note = new Note({
//   content: 'Hello kitty',
//   date: new Date(),
//   important: false
// })
// note.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => console.error(err))

// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })
