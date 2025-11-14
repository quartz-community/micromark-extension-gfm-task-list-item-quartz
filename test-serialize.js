import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function debugHtml() {
  let checkboxChar = ''
  
  return {
    enter: {
      taskListCheck(token) {
        console.log('taskListCheck token:', token)
      },
      taskListCheckValueUnchecked(token) {
        console.log('Unchecked value:', this.sliceSerialize(token))
        checkboxChar = this.sliceSerialize(token)
      },
      taskListCheckValueChecked(token) {
        console.log('Checked value:', this.sliceSerialize(token))
        checkboxChar = this.sliceSerialize(token)
      }
    },
    exit: {
      taskListCheck(token) {
        console.log('Checkbox char at exit:', checkboxChar)
      }
    }
  }
}

const input = '* [ ] unchecked\n* [x] checked\n* [r] obsidian'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [debugHtml()]
})

console.log('\nOutput:')
console.log(output)
