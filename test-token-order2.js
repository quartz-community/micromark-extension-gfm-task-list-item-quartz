import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function debugHtml() {
  let counter = 0
  
  return {
    enter: {
      listUnordered() {
        console.log(++counter, 'enter listUnordered')
      },
      listItemMarker() {
        console.log(++counter, 'enter listItemMarker')
      },
      listItemPrefix() {
        console.log(++counter, 'enter listItemPrefix')
      },
      paragraph() {
        console.log(++counter, 'enter paragraph')
      },
      taskListCheck() {
        console.log(++counter, 'enter taskListCheck')
      },
      taskListCheckValueChecked(token) {
        console.log(++counter, 'enter taskListCheckValueChecked:', this.sliceSerialize(token))
      }
    },
    exit: {
      taskListCheckValueChecked() {
        console.log(++counter, 'exit taskListCheckValueChecked')
      },
      taskListCheck() {
        console.log(++counter, 'exit taskListCheck')
      },
      paragraph() {
        console.log(++counter, 'exit paragraph')
      },
      listItemPrefix() {
        console.log(++counter, 'exit listItemPrefix')
      },
      listItemMarker() {
        console.log(++counter, 'exit listItemMarker')
      },
      listUnordered() {
        console.log(++counter, 'exit listUnordered')
      }
    }
  }
}

const input = '* [x] checked'
micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [debugHtml()]
})
