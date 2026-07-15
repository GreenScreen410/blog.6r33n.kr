import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { imageSize } from 'image-size'

const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

const REQUIRED_ENV = [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
]

const HASH_LENGTH = 8

// Keys are content-addressed, so a key never points at different bytes.
const CACHE_CONTROL = 'public, max-age=31536000, immutable'

// EXIF orientations that turn the image a quarter-turn: browsers and the Next
// image optimizer both honour the flag, so a phone photo tagged this way is
// displayed with its axes swapped relative to how the pixels are stored.
const QUARTER_TURN_ORIENTATIONS = new Set([5, 6, 7, 8])

// Dimensions as they will actually be displayed, which is what <Image> wants.
function displaySize(buffer) {
  const { width, height, orientation } = imageSize(buffer)
  return QUARTER_TURN_ORIENTATIONS.has(orientation)
    ? { width: height, height: width }
    : { width, height }
}

function usage() {
  console.error('Usage: yarn upload-image <post-slug> <file...>')
  console.error("Example: yarn upload-image ucpc-2026 './스크린샷 2026-07-12.png' ./cover.png")
}

function loadConfig() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.error(`Missing env vars: ${missing.join(', ')}`)
    usage()
    process.exit(1)
  }
  return Object.fromEntries(REQUIRED_ENV.map((key) => [key, process.env[key]]))
}

async function uploadOne(client, config, postSlug, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const contentType = CONTENT_TYPES[ext]
  if (!contentType) {
    throw new Error(`Unsupported image extension: ${ext} (${filePath})`)
  }

  const buffer = readFileSync(filePath)
  const { width, height } = displaySize(buffer)

  // The key is derived from the bytes alone: the source filename never matters,
  // and reordering a post never renames anything. Descriptions live in `alt`.
  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, HASH_LENGTH)
  const key = `${postSlug}/${hash}${ext}`

  await client.send(
    new PutObjectCommand({
      Bucket: config.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: CACHE_CONTROL,
    })
  )

  const url = `${config.R2_PUBLIC_URL}/${key}`
  console.log(`\n${filePath} -> ${url}`)
  console.log(`<Image src="${url}" width={${width}} height={${height}} alt="" />`)
}

async function main() {
  const [postSlug, ...files] = process.argv.slice(2)
  if (!postSlug || files.length === 0) {
    usage()
    process.exit(1)
  }

  const config = loadConfig()
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.R2_ACCESS_KEY_ID,
      secretAccessKey: config.R2_SECRET_ACCESS_KEY,
    },
  })

  for (const file of files) {
    await uploadOne(client, config, postSlug, file)
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
