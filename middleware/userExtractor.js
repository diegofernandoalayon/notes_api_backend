const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('authorization')
  let token = ''
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }
  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch {}

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const { id: userId } = decodedToken

  request.userId = userId // mutamos request para pasar userId
  next() // indicamos que siga
}
