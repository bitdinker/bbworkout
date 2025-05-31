
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';

const DB_DIR = path.join(process.cwd(), 'database');
const DB_PATH = path.join(DB_DIR, 'bbw.db3');

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

async function initializeDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  // Ensure database directory exists
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create database directory:', error);
    throw error; // Rethrow to prevent app from starting in a broken state
  }

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS workout_days (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS day_exercises (
      instanceId TEXT PRIMARY KEY,
      workout_day_id TEXT NOT NULL,
      exerciseId TEXT NOT NULL,
      name TEXT NOT NULL,
      bodyPart TEXT NOT NULL,
      imageFilename TEXT NOT NULL,
      reps INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      sort_order INTEGER NOT NULL,
      FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_day_exercises_workout_day_id ON day_exercises (workout_day_id);
  `);
  
  return db;
}

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!dbInstance) {
    dbInstance = await initializeDb();
  }
  return dbInstance;
}
