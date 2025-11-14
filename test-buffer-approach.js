import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function bufferHtml() {
  let listItemBuffer = null
  
  return {
    enter: {
      listItemPrefix() {
        // Start buffering the list item
        this.buffer()
      },
      paragraph() {
        // Check if we're in a buffered list item
        const inBuffer = this.getData('bufferingListItem')
        if (inBuffer) {
          console.log('In paragraph while buffering')
        }
      },
      taskListCheckValueChecked(token) {
        const char = this.sliceSerialize(token)
        console.log('Found checked checkbox:', char)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', true)
      },
      taskListCheckValueUnchecked(token) {
        const char = this.sliceSerialize(token)
        console.log('Found unchecked checkbox:', char)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', false)
      },
      taskListCheck() {
        this.tag('<span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" ')
      }
    },
    exit: {
      listItemPrefix() {
        // Resume and inject the proper <li> tag
        const buffered = this.resume()
        const char = this.getData('taskListCheckboxChar')
        const isChecked = this.getData('taskListCheckboxChecked')
        
        console.log('Resuming with char:', char, 'checked:', isChecked)
        console.log('Buffered content:', buffered)
        
        if (char !== undefined) {
          const classes = isChecked ? 'task-list-item is-checked' : 'task-list-item'
          this.tag(`<li data-task="${this.encode(char)}" class="${classes}">`)
        }
        
        // Output the buffered content
        this.raw(buffered)
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

const input = '* [x] checked'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [bufferHtml()]
})

console.log('\nOutput:')
console.log(output)
