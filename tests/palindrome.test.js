
const { palindrome } = require('../utils/for_testing.js')

test('palindrome of paralelo', () => { // esto serio un test unitario, porque estamos testeando una unidad en concreto
  const result = palindrome('paralelo')

  expect(result).toBe('olelarap')
})

test('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})
test('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
