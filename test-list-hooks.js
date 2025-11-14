import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function testHtml() {
  return {
    enter: {
      list() {
        console.log('enter list')
      },
      listItem() {
        console.log('enter listItem')
      },
      listItemValue() {
        console.log('enter listItemValue')
      },
      taskListCheck() {
        console.log('enter taskListCheck')
      }
    },
    exit: {
      list() {
        console.log('exit list')
      },
      listItem() {
        console.log('exit listItem')
      },
      taskListCheck() {
        console.log('exit taskListCheck')
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
