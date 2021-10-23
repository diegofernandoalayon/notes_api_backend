
const { palindrome } = require('../utils/for_testing.js')

test.skip('palindrome of paralelo', () => { // esto serio un test unitario, porque estamos testeando una unidad en concreto
  const result = palindrome('paralelo')

  expect(result).toBe('olelarap')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})
test.skip('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBeUndefined()
})
