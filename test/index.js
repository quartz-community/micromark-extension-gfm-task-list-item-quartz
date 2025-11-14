import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {micromark} from 'micromark'
import {createGfmFixtures} from 'create-gfm-fixtures'
import {controlPictures} from 'control-pictures'
import {
  gfmTaskListItem,
  gfmTaskListItemHtml
} from 'micromark-extension-gfm-task-list-item'

test('markdown -> html (micromark)', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(
        await import('micromark-extension-gfm-task-list-item')
      ).sort(),
      ['gfmTaskListItem', 'gfmTaskListItemHtml']
    )
  })

  await t.test(
    'should skip `tasklistCheck` construct if `disable.null` includes `tasklistCheck`',
    async function () {
      assert.deepEqual(
        micromark('* [ ] foo', {
          extensions: [gfmTaskListItem(), {disable: {null: ['tasklistCheck']}}],
          htmlExtensions: [gfmTaskListItemHtml()]
        }),
        '<ul><li>[ ] foo</li>\n</ul>\n'
      )
    }
  )

  await t.test('should not support laziness (1)', async function () {
    assert.deepEqual(
      micromark('*\n    [x]', {
        extensions: [gfmTaskListItem()],
        htmlExtensions: [gfmTaskListItemHtml()]
      }),
      '<ul><li>[x]</li>\n</ul>\n'
    )
  })

  await t.test('should not support laziness (2)', async function () {
    assert.deepEqual(
      micromark('*\n[x]', {
        extensions: [gfmTaskListItem()],
        htmlExtensions: [gfmTaskListItemHtml()]
      }),
      '<ul></li>\n</ul>\n\n<li>[x]'
    )
  })

  await t.test(
    'should support ordered lists with task items',
    async function () {
      assert.deepEqual(
        micromark('1. [x] foo\n2. [ ] bar', {
          extensions: [gfmTaskListItem()],
          htmlExtensions: [gfmTaskListItemHtml()]
        }),
        '<ol class="contains-task-list"><li data-task="x" class="task-list-item is-checked"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" checked="" > foo</li>\n<li data-task=" " class="task-list-item"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" > bar</li>\n</ol>\n'
      )
    }
  )

  await t.test(
    'should support ordered lists without task items',
    async function () {
      assert.deepEqual(
        micromark('1. foo\n2. bar', {
          extensions: [gfmTaskListItem()],
          htmlExtensions: [gfmTaskListItemHtml()]
        }),
        '<ol><li>foo</li>\n<li>bar</li>\n</ol>\n'
      )
    }
  )

  await t.test(
    'should support mixed task and non-task items in ordered list',
    async function () {
      assert.deepEqual(
        micromark('1. [x] foo\n2. bar', {
          extensions: [gfmTaskListItem()],
          htmlExtensions: [gfmTaskListItemHtml()]
        }),
        '<ol class="contains-task-list"><li data-task="x" class="task-list-item is-checked"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" checked="" > foo</li>\n<li>bar</li>\n</ol>\n'
      )
    }
  )

  await t.test(
    'should accept any character as checkbox marker',
    async function () {
      assert.deepEqual(
        micromark('* [!] important\n* [?] question\n* [>] forward', {
          extensions: [gfmTaskListItem()],
          htmlExtensions: [gfmTaskListItemHtml()]
        }),
        '<ul class="contains-task-list"><li data-task="!" class="task-list-item is-checked"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" checked="" > important</li>\n<li data-task="?" class="task-list-item is-checked"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" checked="" > question</li>\n<li data-task="&gt;" class="task-list-item is-checked"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" checked="" > forward</li>\n</ul>\n'
      )
    }
  )
})

test('fixtures', async function (t) {
  const base = new URL('fixtures/', import.meta.url)

  await createGfmFixtures(base, {
    controlPictures: true,
    rehypeStringify: {closeSelfClosing: true}
  })

  const files = await fs.readdir(base)
  const extname = '.md'

  for (const d of files) {
    if (!d.endsWith(extname)) {
      continue
    }

    const name = d.slice(0, -extname.length)

    await t.test(name, async function () {
      const input = String(await fs.readFile(new URL(d, base)))
      const expected = String(await fs.readFile(new URL(name + '.html', base)))
      let actual = micromark(controlPictures(input), {
        extensions: [gfmTaskListItem()],
        htmlExtensions: [gfmTaskListItemHtml()]
      })

      if (actual && !/\n$/.test(actual)) {
        actual += '\n'
      }

      // GH uses `=""` on the boolean attributes, but those are dropped by
      // `rehype-stringify`, so hide those changes.
      actual = actual.replace(/(checked|disabled)=""/g, '$1')

      // Note: GH uses a different algorithm in comments.
      // Notably:
      //
      // ```markdown
      // * [
      //   ] With a line feed
      //
      //  * [ ]
      //   Text.
      // ```
      //
      // The previous two do not form inputs in comments, but do form inputs in
      // files.

      assert.deepEqual(actual, expected, name)
    })
  }
})
