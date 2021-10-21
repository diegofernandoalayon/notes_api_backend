module.exports = (request, response) => { // debe ir al final para que no exista problema
  response.status(404).json({
    error: 'Not found'
  })
}
