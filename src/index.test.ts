import test from 'tape'
import { one, two, three, four, numbers } from '.'

test('numbers', (t) => {
  t.equals(one(), 'one', 'one is one')
  t.equals(two(), 'two', 'two is two')
  t.equals(three(), 'three', 'three is three')
  t.equals(four(), 'four', 'four is four')
  t.equals(numbers(), 'one two three four', 'numbers is one two three four')
  t.end()
})
