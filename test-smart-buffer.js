import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function smartBuffer() {
  let listItemCount = 0
  let inTaskListItem = false
  
  return {
    enter: {
      listItemMarker() {
        // Store list item number for this item
        listItemCount++
        console.log('List item #' + listItemCount)
        
        if (this.getData('expectFirstItem')) {
          this.tag('>')
        } else {
          this.tag('</li>')
        }
        
        this.lineEndingIfNeeded()
        // We don't know yet if this is a task list item, so output a placeholder
        this.setData('currentListItem', listItemCount)
        this.setData('listItemStart' + listItemCount, this.getData('bufferLength') || 0)
        this.buffer() // Start buffering
      },
      taskListCheckValueChecked(token) {
        const char = this.sliceSerialize(token)
        const currentItem = this.getData('currentListItem')
        console.log('Found checked checkbox in item #' + currentItem + ':', char)
        this.setData('taskListCheckboxChar' + currentItem, char)
        this.setData('taskListCheckboxChecked' + currentItem, true)
      },
      taskListCheck() {
        this.tag('<span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" ')
      }
    },
    exit: {
      listItemMarker() {
        const currentItem = this.getData('currentListItem')
        const char = this.getData('taskListCheckboxChar' + currentItem)
        const isChecked = this.getData('taskListCheckboxChecked' + currentItem)
        
        const buffered = this.resume()
        console.log('Buffered for item #' + currentItem + ':', buffered.substring(0, 50))
        
        if (char !== undefined) {
          const classes = isChecked ? 'task-list-item is-checked' : 'task-list-item'
          this.tag(`<li data-task="${this.encode(char)}" class="${classes}">`)
        } else {
          this.tag('<li>')
        }
        
        this.raw(buffered)
        
        this.setData('expectFirstItem')
        this.setData('lastWasTag')
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
  htmlExtensions: [smartBuffer()]
})

console.log('\nOutput:')
console.log(output)
