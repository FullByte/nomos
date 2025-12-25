import { NameRecord, ResourceType, CloudProvider, Environment } from '../../../shared/types.js';
import { getDatabase, dbRun, dbGet, dbAll } from '../database/init.js';

export class NameRecordModel {
  static async create(record: Omit<NameRecord, 'id' | 'createdAt'>): Promise<NameRecord> {
    const db = getDatabase();
    const result = await dbRun(
      db,
      `INSERT INTO used_names (name, resource_type, environment, cloud_provider)
       VALUES (?, ?, ?, ?)`,
      [record.name, record.resourceType, record.environment || null, record.cloudProvider || null]
    );

    const created = await this.getById(result.lastID!);
    return created!;
  }

  static async getById(id: number): Promise<NameRecord | undefined> {
    const db = getDatabase();
    return await dbGet<NameRecord>(
      db,
      `SELECT id, name, resource_type as resourceType, environment, cloud_provider as cloudProvider, created_at as createdAt
       FROM used_names WHERE id = ?`,
      [id]
    );
  }

  static async getAll(filters?: {
    resourceType?: ResourceType;
    cloudProvider?: CloudProvider;
    environment?: Environment;
  }): Promise<NameRecord[]> {
    const db = getDatabase();
    let sql = `SELECT id, name, resource_type as resourceType, environment, cloud_provider as cloudProvider, created_at as createdAt
               FROM used_names WHERE 1=1`;
    const params: any[] = [];

    if (filters?.resourceType) {
      sql += ' AND resource_type = ?';
      params.push(filters.resourceType);
    }
    if (filters?.cloudProvider) {
      sql += ' AND cloud_provider = ?';
      params.push(filters.cloudProvider);
    }
    if (filters?.environment) {
      sql += ' AND environment = ?';
      params.push(filters.environment);
    }

    sql += ' ORDER BY created_at DESC';

    return await dbAll<NameRecord>(db, sql, params);
  }

  static async findByName(name: string): Promise<NameRecord | undefined> {
    const db = getDatabase();
    return await dbGet<NameRecord>(
      db,
      `SELECT id, name, resource_type as resourceType, environment, cloud_provider as cloudProvider, created_at as createdAt
       FROM used_names WHERE name = ?`,
      [name]
    );
  }

  static async delete(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await dbRun(db, 'DELETE FROM used_names WHERE id = ?', [id]);
    return result.changes > 0;
  }

  static async deleteByName(name: string): Promise<boolean> {
    const db = getDatabase();
    const result = await dbRun(db, 'DELETE FROM used_names WHERE name = ?', [name]);
    return result.changes > 0;
  }
}

