import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Client } from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const connectionString = process.env.POSTGRES_URL_NON_POOLING
  if (!connectionString) {
    throw new Error('Falta POSTGRES_URL_NON_POOLING (correr con: node --env-file=.env.local node_modules/.bin/tsx scripts/migrate.ts)')
  }

  // Nota: si tu red local intercepta TLS (antivirus/firewall corporativo) esto
  // puede fallar con "self-signed certificate in certificate chain". En ese
  // caso, corre schema.sql directamente en el SQL editor de Supabase en vez
  // de este script — no debilites la verificación TLS para forzarlo.
  const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  const client = new Client({ connectionString })
  await client.connect()
  try {
    await client.query(sql)
    console.log('Esquema aplicado correctamente.')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
