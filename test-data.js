import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function debugHtml() {
  return {
    enter: {
      taskListCheckValueChecked(token) {
        const char = this.sliceSerialize(token)
        console.log('Setting data for char:', char)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', true)
      },
      taskListCheckValueUnchecked(token) {
        const char = this.sliceSerialize(token)
        console.log('Setting data for unchecked char:', char)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', false)
      },
      listItem(token) {
        console.log('listItem enter - checking for data')
        const char = this.getData('taskListCheckboxChar')
        const checked = this.getData('taskListCheckboxChecked')
        console.log('  char:', char, 'checked:', checked)
      }
    },
    exit: {
      listItem(token) {
        console.log('listItem exit')
        const char = this.getData('taskListCheckboxChar')
        if (char !== undefined) {
          console.log('  Found checkbox char:', char)
        }
      }
    }
  }
}

const input = '* [x] checked'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [debugHtml()]
})

console.log('\nOutput:')
console.log(output)
