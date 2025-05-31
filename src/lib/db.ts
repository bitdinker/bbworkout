
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
      name TEXT NOT NULL,
      dayOfWeek TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS day_exercises (
      instanceId TEXT PRIMARY KEY,
      workout_day_id TEXT NOT NULL,
      exerciseId TEXT NOT NULL,
      name TEXT NOT NULL,
      bodyPart TEXT NOT NULL,
      reps INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      sort_order INTEGER NOT NULL,
      FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_day_exercises_workout_day_id ON day_exercises (workout_day_id);
  `);
  
  // Migration for existing tables that might not have dayOfWeek
  try {
    await db.exec('ALTER TABLE workout_days ADD COLUMN dayOfWeek TEXT NOT NULL DEFAULT ""');
    console.log("Successfully added dayOfWeek column to workout_days table.");
  } catch (error) {
    // Ignore error if column already exists (e.g., "duplicate column name: dayOfWeek")
    if (!(error as Error).message.includes('duplicate column name')) {
      console.warn('Could not add dayOfWeek column, it might already exist or another error occurred:', (error as Error).message);
    }
  }
  
  return db;
}

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!dbInstance) {
    dbInstance = await initializeDb();
  }
  return dbInstance;
}
