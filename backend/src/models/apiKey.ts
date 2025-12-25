import { getDatabase, dbRun, dbGet, dbAll } from '../database/init.js';
import crypto from 'crypto';

export interface ApiKeyRecord {
  id?: number;
  keyHash: string;
  name: string;
  description?: string;
  createdAt?: string;
  lastUsedAt?: string | null;
  isActive: boolean;
}

export class ApiKeyModel {
  static generateKey(): string {
    return 'nt_' + crypto.randomBytes(32).toString('hex');
  }

  static hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  static async create(name: string, description?: string): Promise<{ key: string; record: ApiKeyRecord }> {
    const key = this.generateKey();
    const keyHash = this.hashKey(key);
    const db = getDatabase();

    const result = await dbRun(
      db,
      `INSERT INTO api_keys (key_hash, name, description, is_active)
       VALUES (?, ?, ?, 1)`,
      [keyHash, name, description || null]
    );

    const record = await this.getById(result.lastID!);
    return { key, record: record! };
  }

  static async getById(id: number): Promise<ApiKeyRecord | undefined> {
    const db = getDatabase();
    const row = await dbGet<{
      id: number;
      key_hash: string;
      name: string;
      description: string | null;
      created_at: string;
      last_used_at: string | null;
      is_active: number;
    }>(
      db,
      `SELECT id, key_hash, name, description, created_at, last_used_at, is_active
       FROM api_keys WHERE id = ?`,
      [id]
    );

    if (!row) return undefined;

    return {
      id: row.id,
      keyHash: row.key_hash,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at,
      isActive: row.is_active === 1
    };
  }

  static async getAll(): Promise<ApiKeyRecord[]> {
    const db = getDatabase();
    const rows = await dbAll<{
      id: number;
      key_hash: string;
      name: string;
      description: string | null;
      created_at: string;
      last_used_at: string | null;
      is_active: number;
    }>(
      db,
      `SELECT id, key_hash, name, description, created_at, last_used_at, is_active
       FROM api_keys ORDER BY created_at DESC`
    );

    return rows.map(row => ({
      id: row.id,
      keyHash: row.key_hash,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at,
      isActive: row.is_active === 1
    }));
  }

  static async findByKey(key: string): Promise<ApiKeyRecord | undefined> {
    const keyHash = this.hashKey(key);
    const db = getDatabase();
    const row = await dbGet<{
      id: number;
      key_hash: string;
      name: string;
      description: string | null;
      created_at: string;
      last_used_at: string | null;
      is_active: number;
    }>(
      db,
      `SELECT id, key_hash, name, description, created_at, last_used_at, is_active
       FROM api_keys WHERE key_hash = ? AND is_active = 1`,
      [keyHash]
    );

    if (!row) return undefined;

    return {
      id: row.id,
      keyHash: row.key_hash,
      name: row.name,
      description: row.description || undefined,
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at,
      isActive: row.is_active === 1
    };
  }

  static async updateLastUsed(key: string): Promise<void> {
    const keyHash = this.hashKey(key);
    const db = getDatabase();
    await dbRun(
      db,
      `UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE key_hash = ?`,
      [keyHash]
    );
  }

  static async deactivate(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await dbRun(
      db,
      'UPDATE api_keys SET is_active = 0 WHERE id = ?',
      [id]
    );
    return result.changes > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await dbRun(db, 'DELETE FROM api_keys WHERE id = ?', [id]);
    return result.changes > 0;
  }
}


