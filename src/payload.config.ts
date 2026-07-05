import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Packages } from './collections/Packages'
import { Fleet } from './collections/Fleet'
import { Stays } from './collections/Stays'
import { Experiences } from './collections/Experiences'
import { Stories } from './collections/Stories'
import { Enquiries } from './collections/Enquiries'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Database: Postgres in production (Vercel / Neon), SQLite for local dev.
// Set DATABASE_URI (or POSTGRES_URL) to a `postgres://…` string to use Postgres.
const databaseUri =
  process.env.DATABASE_URI ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'file:./kartikart.db'
const usePostgres = /^postgres(ql)?:\/\//.test(databaseUri)

const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseUri }, push: true })
  : sqliteAdapter({ client: { url: databaseUri } })

// Media storage: Vercel Blob when its token is present (production), local disk otherwise (dev).
const plugins = process.env.BLOB_READ_WRITE_TOKEN
  ? [
      vercelBlobStorage({
        enabled: true,
        collections: { media: true },
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Kartikart Admin',
    },
  },
  collections: [Packages, Fleet, Stays, Experiences, Stories, Enquiries, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  plugins,
  sharp,
})
