export {gfmTaskListItemHtml} from './lib/html.js'
export {gfmTaskListItem} from './lib/syntax.js'

/**
 * Augment types.
 */
declare module 'micromark-util-types' {
  /**
   * Token types.
   */
  interface TokenTypeMap {
    taskListCheck: 'taskListCheck'
    taskListCheckMarker: 'taskListCheckMarker'
    taskListCheckValueChecked: 'taskListCheckValueChecked'
    taskListCheckValueUnchecked: 'taskListCheckValueUnchecked'
  }

  /**
   * Compile data.
   */
  interface CompileData {
    bufferingList?: boolean | undefined
    bufferingOrderedList?: boolean | undefined
    hasTaskListInList?: boolean | undefined
    needsListItemTag?: boolean | undefined
    taskListCheckboxChar?: string | undefined
    taskListCheckboxChecked?: boolean | undefined
  }
}
