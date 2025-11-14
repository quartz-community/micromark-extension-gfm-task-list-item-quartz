import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function replaceHandlers() {
  return {
    enter: {
      // Completely replace the default listItemMarker handler
      listItemMarker() {
        console.log('Custom listItemMarker enter')
        if (this.getData('expectFirstItem')) {
          this.tag('>')
        } else {
          this.tag('</li>')
        }
        
        this.lineEndingIfNeeded()
        this.tag('<li data-custom="test">')
        this.setData('expectFirstItem')
        this.setData('lastWasTag')
      },
      taskListCheckValueChecked(token) {
        const char = this.sliceSerialize(token)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', true)
      },
      taskListCheck() {
        this.tag('<span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" ')
      }
    },
    exit: {
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
  htmlExtensions: [replaceHandlers()]
})

console.log('Output:')
console.log(output)
