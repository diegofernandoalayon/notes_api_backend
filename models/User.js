const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId, // para guardar el obtectId y referenciarlo
    ref: 'Note' // para referenciarlo al modelo de Note
  }]
})
userSchema.set('toJSON', { // para cambiar la forma en que se realiza el toJSON de la respuesta
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash // para que no devuelva el password y no sea desvelado
  }
})
userSchema.plugin(uniqueValidator)
const User = model('User', userSchema)

module.exports = User
