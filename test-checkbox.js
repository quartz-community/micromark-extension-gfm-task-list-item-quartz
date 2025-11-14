import {micromark} from 'micromark'
import {gfmTaskListItem, gfmTaskListItemHtml} from './dev/index.js'

const input = '* [ ] unchecked\n* [x] checked\n* [r] obsidian'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [gfmTaskListItemHtml()]
})

console.log('Input:')
console.log(input)
console.log('\nOutput:')
console.log(output)
