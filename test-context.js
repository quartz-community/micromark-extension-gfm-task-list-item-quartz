import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function testHtml() {
  return {
    enter: {
      taskListCheck() {
        console.log('Context methods:', Object.keys(this))
        console.log('buffer method:', this.buffer)
        console.log('raw method:', this.raw)
      }
    }
  }
}

const input = '* [x] checked'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [testHtml()]
})

console.log('\nOutput:')
console.log(output)
