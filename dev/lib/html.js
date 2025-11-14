/**
 * @import {HtmlExtension} from 'micromark-util-types'
 */

/**
 * Create an HTML extension for `micromark` to support GFM task list items when
 * serializing to HTML.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions` to
 *   support GFM task list items when serializing to HTML.
 */
export function gfmTaskListItemHtml() {
  return {
    enter: {
      listUnordered() {
        // Start buffering so we can check if this list contains task items
        this.setData('bufferingList', true)
        this.buffer()
      },
      listOrdered() {
        // Start buffering so we can check if this list contains task items
        this.setData('bufferingList', true)
        this.setData('bufferingOrderedList', true)
        this.buffer()
      },
      listItemMarker() {
        // Close previous list item if needed
        if (this.getData('expectFirstItem')) {
          this.tag('>')
        } else {
          this.tag('</li>')
        }

        this.lineEndingIfNeeded()
        // Mark that we're in a list item that needs a tag
        this.setData('needsListItemTag', true)
      },
      paragraph() {
        // Only buffer if we're at the start of a list item
        // This allows us to check for task list checkbox before generating the <li> tag
        if (this.getData('needsListItemTag')) {
          this.buffer()
        }
      },
      taskListCheckValueChecked(token) {
        const char = this.sliceSerialize(token)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', true)
        this.setData('hasTaskListInList', true)
      },
      taskListCheckValueUnchecked(token) {
        const char = this.sliceSerialize(token)
        this.setData('taskListCheckboxChar', char)
        this.setData('taskListCheckboxChecked', false)
        this.setData('hasTaskListInList', true)
      },
      taskListCheck() {
        this.tag(
          '<span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" '
        )
      }
    },
    exit: {
      listUnordered() {
        if (this.getData('bufferingList')) {
          let buffered = this.resume()
          const hasTaskList = this.getData('hasTaskListInList')

          // Remove the leading </li> that was captured from the first listItemMarker
          buffered = buffered.replace(/^<\/li>\s*/, '')

          this.lineEndingIfNeeded()
          if (hasTaskList) {
            this.tag('<ul class="contains-task-list">')
          } else {
            this.tag('<ul>')
          }

          this.raw(buffered)

          // Close the last list item and the list
          this.tag('</li>')
          this.lineEndingIfNeeded()
          this.tag('</ul>')
          this.lineEndingIfNeeded()

          this.setData('bufferingList', false)
          this.setData('hasTaskListInList', false)
        }
      },
      listOrdered() {
        if (this.getData('bufferingList')) {
          let buffered = this.resume()
          const hasTaskList = this.getData('hasTaskListInList')

          // Remove the leading </li> that was captured from the first listItemMarker
          buffered = buffered.replace(/^<\/li>\s*/, '')

          this.lineEndingIfNeeded()
          if (hasTaskList) {
            this.tag('<ol class="contains-task-list">')
          } else {
            this.tag('<ol>')
          }

          this.raw(buffered)

          // Close the last list item and the list
          this.tag('</li>')
          this.lineEndingIfNeeded()
          this.tag('</ol>')
          this.lineEndingIfNeeded()

          this.setData('bufferingList', false)
          this.setData('bufferingOrderedList', false)
          this.setData('hasTaskListInList', false)
        }
      },
      paragraph() {
        if (this.getData('needsListItemTag')) {
          // Get the buffered paragraph content
          const buffered = this.resume()
          const char = this.getData('taskListCheckboxChar')
          const isChecked = this.getData('taskListCheckboxChecked')

          // Generate the <li> tag with task list attributes if this is a task list item
          if (char === undefined) {
            // Regular list item without task checkbox
            this.tag('<li>')
          } else {
            const classes = isChecked
              ? 'task-list-item is-checked'
              : 'task-list-item'
            this.tag(
              `<li data-task="${this.encode(String(char))}" class="${classes}">`
            )
          }

          // Output the buffered paragraph content (without <p> tags in tight lists)
          this.raw(buffered)

          // Clean up state for next list item
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
