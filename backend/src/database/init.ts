import sqlite3 from 'sqlite3';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_DIR = join(__dirname, '../../data');
const DB_PATH = process.env.DB_PATH || join(DB_DIR, 'nomos.db');

// Stelle sicher, dass das Datenbank-Verzeichnis existiert
try {
  mkdirSync(DB_DIR, { recursive: true });
} catch (error) {
  // Verzeichnis existiert bereits oder Fehler - ignorieren
}

export function initDatabase(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Fehler beim Öffnen der Datenbank:', err);
        reject(err);
        return;
      }
      console.log('Datenbank verbunden:', DB_PATH);
    });

    // Schema ausführen
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    db.exec(schema, (err) => {
      if (err) {
        console.error('Fehler beim Erstellen des Schemas:', err);
        reject(err);
        return;
      }
      console.log('Datenbank-Schema initialisiert');
      resolve(db);
    });
  });
}

export function getDatabase(): sqlite3.Database {
  return new sqlite3.Database(DB_PATH);
}

// Helper-Funktion für Promise-basierte DB-Operationen
export function dbRun(db: sqlite3.Database, sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

export function dbGet<T>(db: sqlite3.Database, sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T);
      }
    });
  });
}

export function dbAll<T>(db: sqlite3.Database, sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
}

