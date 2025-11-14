import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function paraBuffer() {
  return {
    enter: {
      listItemMarker() {
        if (this.getData('expectFirstItem')) {
          this.tag('>')
        } else {
          this.tag('</li>')
        }
        
        this.lineEndingIfNeeded()
        // Mark that we're starting a list item - we'll replace this later if needed
        this.setData('needsListItemTag', true)
      },
      paragraph() {
        if (this.getData('needsListItemTag')) {
          // Start buffering the paragraph content
          this.buffer()
        }
      },
      taskListCheckValueChecked(token) {
        const char = this.sliceSerialize(token)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', true)
      },
      taskListCheckValueUnchecked(token) {
        const char = this.sliceSerialize(token)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', false)
      },
      taskListCheck() {
        this.tag('<span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" ')
      }
    },
    exit: {
      paragraph() {
        if (this.getData('needsListItemTag')) {
          const buffered = this.resume()
          const char = this.getData('taskListCheckboxChar')
          const isChecked = this.getData('taskListCheckboxChecked')
          
          if (char !== undefined) {
            const classes = isChecked ? 'task-list-item is-checked' : 'task-list-item'
            this.tag(`<li data-task="${this.encode(char)}" class="${classes}">`)
          } else {
            this.tag('<li>')
          }
          
          // Check if paragraph needs <p> tags (tight vs loose list)
          if (!this.getData('tightStack').at(-1)) {
            this.tag('<p>')
          }
          
          this.raw(buffered)
          
          if (!this.getData('tightStack').at(-1)) {
            this.lineEndingIfNeeded()
            this.tag('</p>')
          }
          
          this.setData('needsListItemTag', false)
          this.setData('taskListCheckboxChar', undefined)
          this.setData('taskListCheckboxChecked', undefined)
          this.setData('expectFirstItem')
          this.setData('lastWasTag')
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

const input = '* [x] checked\n* [ ] unchecked\n* normal'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [paraBuffer()]
})

console.log('Output:')
console.log(output)
