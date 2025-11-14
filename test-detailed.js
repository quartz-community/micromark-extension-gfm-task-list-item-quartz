import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

// Create a custom HTML extension that logs events
function debugHtml() {
  return {
    enter: {
      taskListCheck(...args) {
        console.log('enter taskListCheck', this)
      },
      taskListCheckValueUnchecked(...args) {
        console.log('enter taskListCheckValueUnchecked')
      },
      taskListCheckValueChecked(...args) {
        console.log('enter taskListCheckValueChecked')
      }
    },
    exit: {
      taskListCheck(...args) {
        console.log('exit taskListCheck')
      },
      taskListCheckValueUnchecked(...args) {
        console.log('exit taskListCheckValueUnchecked')
      },
      taskListCheckValueChecked(...args) {
        console.log('exit taskListCheckValueChecked')
      }
    }
  }
}

const input = '* [r] obsidian'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [debugHtml()]
})

console.log('\nOutput:')
console.log(output)
