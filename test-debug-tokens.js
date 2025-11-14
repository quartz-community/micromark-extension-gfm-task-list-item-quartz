import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

function debugHtml() {
  let counter = 0
  
  return {
    enter: {
      listUnordered() {
        console.log(++counter, 'enter listUnordered')
      },
      listItem() {
        console.log(++counter, 'enter listItem')
      },
      listItemPrefix() {
        console.log(++counter, 'enter listItemPrefix')
      },
      listItemMarker() {
        console.log(++counter, 'enter listItemMarker')
      },
      listItemValue() {
        console.log(++counter, 'enter listItemValue')
      },
      taskListCheck() {
        console.log(++counter, 'enter taskListCheck')
      },
      taskListCheckValueChecked(token) {
        console.log(++counter, 'enter taskListCheckValueChecked:', this.sliceSerialize(token))
      },
      paragraph() {
        console.log(++counter, 'enter paragraph')
      }
    },
    exit: {
      taskListCheckValueChecked() {
        console.log(++counter, 'exit taskListCheckValueChecked')
      },
      taskListCheck() {
        console.log(++counter, 'exit taskListCheck')
      },
      listItemMarker() {
        console.log(++counter, 'exit listItemMarker')
      },
      listItemPrefix() {
        console.log(++counter, 'exit listItemPrefix')
      },
      paragraph() {
        console.log(++counter, 'exit paragraph')
      },
      listItem() {
        console.log(++counter, 'exit listItem')
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
