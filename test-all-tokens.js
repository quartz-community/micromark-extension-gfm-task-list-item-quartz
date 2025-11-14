import {micromark} from 'micromark'
import {gfmTaskListItem} from './dev/lib/syntax.js'

const allTokens = new Set()

function captureAllTokens() {
  return {
    enter: new Proxy({}, {
      get(target, prop) {
        return function(...args) {
          allTokens.add('enter:' + String(prop))
        }
      }
    }),
    exit: new Proxy({}, {
      get(target, prop) {
        return function(...args) {
          allTokens.add('exit:' + String(prop))
        }
      }
    })
  }
}

const input = '* [x] checked'
micromark(input, {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [captureAllTokens()]
})

console.log('All tokens:', Array.from(allTokens).sort())
