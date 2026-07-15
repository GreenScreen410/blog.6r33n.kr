import { existsSync, readdirSync } from 'fs'
import path from 'path'

// Emoji are vendored into the repo by scripts/sync-emoji.mjs:
//   Unicode  🤔          -> public/emoji/unicode/1f914.png   (C1710/blobmoji)
//   Shortcode :blobcheer: -> public/emoji/blob/blobcheer.png  (blobs.gg set)
//
// This runs on hast rather than mdast so it can emit a real inline <img>
// element. The mdast equivalent compiles to an `mdxJsxTextElement`, which
// rehype-minify-whitespace does not recognise as inline — it treats the unknown
// node as a block and eats the space next to it, gluing the emoji to the
// following word.
const UNICODE_DIR = path.join(process.cwd(), 'public', 'emoji', 'unicode')
const BLOB_DIR = path.join(process.cwd(), 'public', 'emoji', 'blob')

// One pass finds both forms: a real emoji grapheme, or a :shortcode:. The `v`
// flag is what makes \p{RGI_Emoji} available, and it also reserves `-` inside a
// character class, hence the escape.
const EMOJI_OR_SHORTCODE = /(\p{RGI_Emoji})|:([a-zA-Z0-9_+\-]+):/gv

// Code keeps its literal text, and KaTeX output is machine-generated markup we
// have no business rewriting.
const SKIP_TAGS = new Set(['code', 'pre'])
const isSkipped = (node) =>
  node.type === 'element' &&
  (SKIP_TAGS.has(node.tagName) ||
    [].concat(node.properties?.className ?? []).some((name) => String(name).startsWith('katex')))

// Filename convention inherited from noto-emoji: the codepoints in hex, joined
// by underscores, with the FE0F variation selector dropped.
export function codepointName(emoji) {
  return [...emoji]
    .map((char) => char.codePointAt(0))
    .filter((cp) => cp !== 0xfe0f)
    .map((cp) => cp.toString(16))
    .join('_')
}

function vendoredNames(dir) {
  if (!existsSync(dir)) return new Set()
  return new Set(
    readdirSync(dir)
      .filter((file) => file.endsWith('.png'))
      .map((file) => path.basename(file, '.png'))
  )
}

function imageNode(src, alt) {
  return {
    type: 'element',
    tagName: 'img',
    properties: { src, alt, className: ['emoji'], loading: 'lazy' },
    children: [],
  }
}

export default function rehypeEmoji() {
  const splitText = (node, unicode, blobs) => {
    const parts = []
    let cursor = 0

    for (const match of node.value.matchAll(EMOJI_OR_SHORTCODE)) {
      const [matched, emoji, shortcode] = match

      // Anything not vendored is left alone: an unknown :word: stays literal
      // text, and an emoji with no blob design falls back to the reader's
      // system font rather than a broken image.
      let image = null
      if (emoji) {
        const name = codepointName(emoji)
        if (unicode.has(name)) image = imageNode(`/emoji/unicode/${name}.png`, emoji)
      } else if (blobs.has(shortcode)) {
        image = imageNode(`/emoji/blob/${shortcode}.png`, `:${shortcode}:`)
      }
      if (!image) continue

      if (match.index > cursor) {
        parts.push({ type: 'text', value: node.value.slice(cursor, match.index) })
      }
      parts.push(image)
      cursor = match.index + matched.length
    }

    if (parts.length === 0) return [node]
    if (cursor < node.value.length) {
      parts.push({ type: 'text', value: node.value.slice(cursor) })
    }
    return parts
  }

  // Hand-rolled walk rather than unist-util-visit: skipping a subtree means not
  // descending into it at all, and highlighted code nests text several elements
  // below <code>, so an immediate-parent check would not be enough.
  const walk = (node, unicode, blobs) => {
    if (!Array.isArray(node.children) || isSkipped(node)) return

    const children = []
    for (const child of node.children) {
      if (child.type === 'text') {
        children.push(...splitText(child, unicode, blobs))
      } else {
        walk(child, unicode, blobs)
        children.push(child)
      }
    }
    node.children = children
  }

  // Read the vendored set per document rather than once at plugin init: a dev
  // server that was already running when `yarn sync-emoji` fetched a new emoji
  // would otherwise keep using the stale list and leave the shortcode as text.
  return (tree) => walk(tree, vendoredNames(UNICODE_DIR), vendoredNames(BLOB_DIR))
}
