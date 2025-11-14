import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function customHtml() {
  let checkboxChar
  let isChecked = false
  let hasTaskListItem = false
  
  return {
    enter: {
      listOrdered() {
        if (hasTaskListItem) {
          this.lineEndingIfNeeded()
          this.tag('<ol class="contains-task-list">')
        }
      },
      listUnordered() {
        hasTaskListItem = false
        this.lineEndingIfNeeded()
        this.tag('<ul class="contains-task-list">')
      },
      listItem() {
        checkboxChar = this.getData('taskListCheckboxChar')
        isChecked = this.getData('taskListCheckboxChecked') || false
        
        if (checkboxChar !== undefined) {
          const classes = isChecked ? 'task-list-item is-checked' : 'task-list-item'
          this.tag(`<li data-task="${this.encode(checkboxChar)}" class="${classes}">`)
        }
      },
      taskListCheckValueChecked(token) {
        checkboxChar = this.sliceSerialize(token)
        isChecked = true
        this.setData('taskListCheckboxChar', checkboxChar)
        this.setData('taskListCheckboxChecked', true)
        hasTaskListItem = true
      },
      taskListCheckValueUnchecked(token) {
        checkboxChar = this.sliceSerialize(token)
        isChecked = false
        this.setData('taskListCheckboxChar', checkboxChar)
        this.setData('taskListCheckboxChecked', false)
        hasTaskListItem = true
      },
      taskListCheck() {
        this.tag('<span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" ')
      }
    },
    exit: {
      listUnordered() {
        this.tag('</ul>')
        this.lineEndingIfNeeded()
      },
      listOrdered() {
        this.tag('</ol>')
        this.lineEndingIfNeeded()
      },
      listItem() {
        if (checkboxChar !== undefined) {
          this.tag('</li>')
          this.setData('taskListCheckboxChar', undefined)
          this.setData('taskListCheckboxChecked', undefined)
        }
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
  htmlExtensions: [customHtml()]
})

console.log('Output:')
console.log(output)
