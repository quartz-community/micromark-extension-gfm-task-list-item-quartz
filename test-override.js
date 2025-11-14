import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function overrideHtml() {
  let checkboxChar
  let isChecked = false
  
  return {
    enter: {
      list() {
        // Override the default list opening tag
        this.tag('<ul class="contains-task-list">')
      },
      listItem() {
        // Store the current checkbox state
        checkboxChar = this.getData('taskListCheckboxChar')
        isChecked = this.getData('taskListCheckboxChecked') || false
        
        if (checkboxChar !== undefined) {
          const classes = isChecked ? 'task-list-item is-checked' : 'task-list-item'
          this.tag(`<li data-task="${this.encode(checkboxChar)}" class="${classes}">`)
        } else {
          this.tag('<li>')
        }
      },
      taskListCheckValueChecked(token) {
        checkboxChar = this.sliceSerialize(token)
        isChecked = true
        this.setData('taskListCheckboxChar', checkboxChar)
        this.setData('taskListCheckboxChecked', true)
      },
      taskListCheckValueUnchecked(token) {
        checkboxChar = this.sliceSerialize(token)
        isChecked = false
        this.setData('taskListCheckboxChar', checkboxChar)
        this.setData('taskListCheckboxChecked', false)
      },
      taskListCheck() {
        this.tag('<span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" ')
      }
    },
    exit: {
      list() {
        this.tag('</ul>')
      },
      listItem() {
        this.tag('</li>')
        this.setData('taskListCheckboxChar', undefined)
        this.setData('taskListCheckboxChecked', undefined)
      },
      taskListCheck() {
        this.tag('>')
      },
      taskListCheckValueChecked() {
        this.tag('checked="" ')
      }
    }
  }
}

const input = '* [ ] unchecked\n* [x] checked\n* [r] obsidian'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [overrideHtml()]
})

console.log('Output:')
console.log(output)
