const mongoose = require('mongoose')

const connectionString = 'mongodb+srv://chanchitoFeliz:LACASA.es98@cluster0.d1br2.mongodb.net/notes-db?retryWrites=true&w=majority'

// conexión a mongodb

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })
