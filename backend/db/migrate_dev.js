// migrate_prod.js
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { Client } = require('pg')

async function migrate() {
  // Prevent accidental use in prod
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ This script should not be run in production.')
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not defined.')
    process.exit(1)
  }

  // Ensure DATABASE_URL is set
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('❌ Error: DATABASE_URL is not set in the environment.')
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()

    // Ensure migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    // Load all .sql files from the migrations directory
    const migrationsDir = path.join(__dirname, 'migrations_dev')
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    const { rows } = await client.query('SELECT filename FROM migrations')
    const applied = new Set(rows.map(r => r.filename))

    const pending = migrationFiles.filter(f => !applied.has(f))

    if (pending.length === 0) {
      console.log('✅ No new migrations to apply.')
      return
    }

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
      console.log(`⚙️ Applying: ${file}...`)

      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO migrations(filename) VALUES($1)', [file])
        await client.query('COMMIT')
        console.log(`✅ Applied migration: ${file}`)
      } catch (err) {
        await client.query('ROLLBACK')
        console.error(`❌ Failed migration: ${file}`)
        throw err
      }
    }

    console.log('🚀 All pending migrations have been applied.')
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrate()
