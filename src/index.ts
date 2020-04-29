import prompt from 'zeelib/lib/term-prompt'

export const one = () => 'one'
export const two = () => 'two'
export const three = () => 'three'
export const four = () => 'four'
export const numbers = () => [one, two, three, four].map((a) => a()).join(' ')

export default () => {
  prompt('Should I log some numbers?', true).then((answer: boolean) => {
    if (answer) {
      // eslint-disable-next-line no-console
      console.log(numbers())
    }
  })
}
