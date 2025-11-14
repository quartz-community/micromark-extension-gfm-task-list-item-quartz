import {micromark} from 'micromark'
import {gfmTaskListItem, gfmTaskListItemHtml} from './dev/index.js'

const input = '* [ ] unchecked\n* [x] checked\n* [r] obsidian'
const output = micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [gfmTaskListItemHtml()]
})

console.log('Output:')
console.log(output)
console.log('\nExpected structure:')
console.log('<ul class="contains-task-list">')
console.log('  <li data-task="" class="task-list-item"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle">unchecked</li>')
console.log('  <li data-task="x" class="task-list-item is-checked"><span class="list-bullet"></span><input checked="" type="checkbox" class="checkbox-toggle">checked</li>')
console.log('  <li data-task="r" class="task-list-item is-checked"><span class="list-bullet"></span><input checked="" type="checkbox" class="checkbox-toggle">obsidian</li>')
console.log('</ul>')
