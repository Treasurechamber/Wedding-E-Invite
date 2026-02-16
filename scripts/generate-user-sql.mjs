#!/usr/bin/env node
/**
 * Generate SQL to add Master or Admin user manually in Supabase.
 * Usage: node scripts/generate-user-sql.mjs master your@email.com YourPassword
 *        node scripts/generate-user-sql.mjs admin your@email.com YourPassword
 */
import { pbkdf2Sync, randomBytes } from "crypto";

const SALT_LEN = 16;
const HASH_ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha512";

function hashPassword(password) {
  const salt = randomBytes(SALT_LEN).toString("hex");
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

const role = process.argv[2]?.toLowerCase();
const email = process.argv[3]?.trim();
const password = process.argv[4];

if (!role || !email || !password) {
  console.log(`
Usage:
  node scripts/generate-user-sql.mjs master your@email.com YourPassword
  node scripts/generate-user-sql.mjs admin your@email.com YourPassword

Then copy the SQL below and run it in Supabase Dashboard → SQL Editor
`);
  process.exit(1);
}

const emailNorm = email.toLowerCase();
const passwordHash = hashPassword(password);

if (role === "master") {
  console.log(`
-- Run this in Supabase SQL Editor to add Master user:
INSERT INTO master_users (email, password_hash)
VALUES ('${emailNorm}', '${passwordHash}')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
`);
} else if (role === "admin") {
  console.log(`
-- Run this in Supabase SQL Editor to add Admin user:
INSERT INTO admin_users (email, password_hash)
VALUES ('${emailNorm}', '${passwordHash}')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
`);
} else {
  console.log('Role must be "master" or "admin"');
  process.exit(1);
}
