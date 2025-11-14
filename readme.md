# micromark-extension-gfm-task-list-item

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[micromark][] extensions to support GFM [task list items][].

## Contents

* [What is this?](#what-is-this)
* [When to use this](#when-to-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`gfmTaskListItem()`](#gfmtasklistitem)
  * [`gfmTaskListItemHtml()`](#gfmtasklistitemhtml)
* [Authoring](#authoring)
* [HTML](#html)
* [CSS](#css)
* [Syntax](#syntax)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package contains extensions that add support for task lists with
Obsidian-flavored markdown compatibility to [`micromark`][micromark].

Unlike standard GFM which only supports `[x]` and `[ ]`, this extension accepts
any character as a checkbox marker (e.g., `[!]`, `[?]`, `[>]`), enabling
Obsidian-compatible task lists with custom styling.

## When to use this

This project is useful when you want to support Obsidian-style task lists in markdown,
particularly for projects using Quartz or other Obsidian-compatible tools.

You can use these extensions when you are working with [`micromark`][micromark].
For standard GFM support without Obsidian extensions, use
[`micromark-extension-gfm`][micromark-extension-gfm].

When you need a syntax tree, you can combine this package with
[`mdast-util-gfm-task-list-item`][mdast-util-gfm-task-list-item].

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install micromark-extension-gfm-task-list-item
```

In Deno with [`esm.sh`][esmsh]:

```js
import {gfmTaskListItem, gfmTaskListItemHtml} from 'https://esm.sh/micromark-extension-gfm-task-list-item@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {gfmTaskListItem, gfmTaskListItemHtml} from 'https://esm.sh/micromark-extension-gfm-task-list-item@2?bundle'
</script>
```

## Use

```js
import {micromark} from 'micromark'
import {
  gfmTaskListItem,
  gfmTaskListItemHtml
} from 'micromark-extension-gfm-task-list-item'

const output = micromark('* [x] a\n* [ ] b\n* [!] c', {
  extensions: [gfmTaskListItem()],
  htmlExtensions: [gfmTaskListItemHtml()]
})

console.log(output)
```

Yields:

```html
<ul class="contains-task-list">
<li data-task="x" class="task-list-item is-checked"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" checked /> a</li>
<li data-task=" " class="task-list-item"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" /> b</li>
<li data-task="!" class="task-list-item is-checked"><span class="list-bullet"></span><input type="checkbox" class="checkbox-toggle" checked /> c</li>
</ul>
```

## API

This package exports the identifiers [`gfmTaskListItem`][api-gfm-task-list-item]
and [`gfmTaskListItemHtml`][api-gfm-task-list-item-html].
There is no default export.

The export map supports the [`development` condition][development].
Run `node --conditions development module.js` to get instrumented dev code.
Without this condition, production code is loaded.

### `gfmTaskListItem()`

Create an HTML extension for `micromark` to support Obsidian-flavored task list items
syntax.

This extension accepts any character as a checkbox marker (not just `x` and space).
Characters other than space or tab are treated as "checked" items.

###### Returns

Extension for `micromark` that can be passed in `extensions`, to enable task
list items syntax ([`Extension`][micromark-extension]).

### `gfmTaskListItemHtml()`

Create an HTML extension for `micromark` to support task list items when
serializing to HTML.

This extension generates Obsidian-compatible HTML with:

* `class="contains-task-list"` on lists containing task items
* `data-task` attribute on list items containing the checkbox character
* `class="task-list-item is-checked"` on checked items
* `class="task-list-item"` on unchecked items
* `<span class="list-bullet"></span>` before each checkbox
* `class="checkbox-toggle"` on checkbox inputs
* No `disabled` attribute on checkboxes (enabling interaction)

###### Returns

Extension for `micromark` that can be passed in `htmlExtensions` to support
task list items when serializing to HTML
([`HtmlExtension`][micromark-html-extension]).

## Authoring

This extension supports Obsidian-flavored markdown task lists, where any character
can be used as a checkbox marker. Common examples:

* `[ ]` — unchecked (space or tab)
* `[x]` or `[X]` — checked
* `[!]` — important (treated as checked)
* `[?]` — question (treated as checked)
* `[>]` — forward/scheduled (treated as checked)
* `[r]` — review (treated as checked)

Any character except space, tab, newline, `[`, or `]` can be used as a checkbox marker.
The square brackets `[` and `]` are excluded to avoid confusion with wikilink syntax.
All non-whitespace characters are treated as "checked" items, allowing custom
styling based on the `data-task` attribute.

## HTML

Checks relate to the `<input>` element, in the checkbox state (`type=checkbox`),
in HTML.
See [*§ 4.10.5.1.15 Checkbox state (`type=checkbox`)*][html-input-checkbox]
in the HTML spec for more info.

```html
<!--…-->
<li><input type="checkbox" disabled="" /> foo</li>
<li><input type="checkbox" disabled="" checked="" /> bar</li>
<!--…-->
```

## CSS

This extension generates Obsidian-compatible markup that can be styled similar to Obsidian.
You can target specific checkbox types using the `data-task` attribute:

```css
/* Style all checkboxes */
.task-list-item input[type="checkbox"] {
  margin-right: 0.5em;
}

/* Style checked items */
.task-list-item.is-checked {
  text-decoration: line-through;
  opacity: 0.7;
}

/* Style specific checkbox types using data-task attribute */
li[data-task="!"] {
  color: red;
}

li[data-task="?"] {
  color: orange;
}

li[data-task=">"] {
  color: blue;
}
```

For Obsidian-compatible styling, see the [Obsidian CSS documentation](https://help.obsidian.md/Editing+and+formatting/Basic+formatting+syntax#Task+lists).

## Syntax

Checks form with the following BNF:

```abnf
gfmTaskListItemCheck ::= "[" (%x09 / " " / <any character except ]>) "]"
```

The check is only allowed at the start of the first paragraph, optionally
following zero or more definitions or a blank line, in a list item.
The check must be followed by whitespace (`[\t\n\r ]*`), which is in turn
followed by non-whitespace.

Whitespace characters (space `%x20` or tab `%x09`) represent unchecked items.
All other characters except `[` and `]` represent checked items with custom markers.
The square brackets are excluded to avoid confusion with Obsidian's wikilink syntax.

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`micromark-extension-gfm-task-list-item@^2`, compatible with Node.js 16.

This package works with `micromark` version `3` and later.

## Security

This package is safe.

## Related

* [`micromark-extension-gfm`][micromark-extension-gfm]
  — support all of GFM
* [`mdast-util-gfm-task-list-item`][mdast-util-gfm-task-list-item]
  — support all of GFM in mdast
* [`mdast-util-gfm`][mdast-util-gfm]
  — support all of GFM in mdast
* [`remark-gfm`][remark-gfm]
  — support all of GFM in remark

## Contribute

See [`contributing.md` in `micromark/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/micromark/micromark-extension-gfm-task-list-item/workflows/main/badge.svg

[build]: https://github.com/micromark/micromark-extension-gfm-task-list-item/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/micromark/micromark-extension-gfm-task-list-item.svg

[coverage]: https://codecov.io/github/micromark/micromark-extension-gfm-task-list-item

[downloads-badge]: https://img.shields.io/npm/dm/micromark-extension-gfm-task-list-item.svg

[downloads]: https://www.npmjs.com/package/micromark-extension-gfm-task-list-item

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=micromark-extension-gfm-task-list-item

[size]: https://bundlejs.com/?q=micromark-extension-gfm-task-list-item

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/micromark/micromark/discussions

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/micromark/.github/blob/main/contributing.md

[support]: https://github.com/micromark/.github/blob/main/support.md

[coc]: https://github.com/micromark/.github/blob/main/code-of-conduct.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[development]: https://nodejs.org/api/packages.html#packages_resolving_user_conditions

[micromark]: https://github.com/micromark/micromark

[micromark-html-extension]: https://github.com/micromark/micromark#htmlextension

[micromark-extension]: https://github.com/micromark/micromark#syntaxextension

[micromark-extension-gfm]: https://github.com/micromark/micromark-extension-gfm

[mdast-util-gfm-task-list-item]: https://github.com/syntax-tree/mdast-util-gfm-task-list-item

[mdast-util-gfm]: https://github.com/syntax-tree/mdast-util-gfm

[remark-gfm]: https://github.com/remarkjs/remark-gfm

[task list items]: https://github.github.com/gfm/#task-list-items-extension-

[github-markdown-css]: https://github.com/sindresorhus/github-markdown-css

[html-input-checkbox]: https://html.spec.whatwg.org/multipage/input.html#checkbox-state-\(type=checkbox\)

[api-gfm-task-list-item]: #gfmtasklistitem

[api-gfm-task-list-item-html]: #gfmtasklistitemhtml
