import { Router } from 'express';
import { getDatabase, dbRun, dbGet, dbAll } from '../database/init.js';
import { NamingConfig } from '../../../shared/types.js';

const router = Router();

// Alle Konfigurationen abrufen
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const { resourceType, cloudProvider } = req.query;

    let sql = `SELECT id, name, resource_type as resourceType, cloud_provider as cloudProvider, 
               environment, config_json as configJson, is_default as isDefault, created_at as createdAt
               FROM naming_configs WHERE 1=1`;
    const params: any[] = [];

    if (resourceType) {
      sql += ' AND resource_type = ?';
      params.push(resourceType);
    }
    if (cloudProvider) {
      sql += ' AND cloud_provider = ?';
      params.push(cloudProvider);
    }

    sql += ' ORDER BY is_default DESC, created_at DESC';

    const rows = await dbAll<any>(db, sql, params);
    const configs = rows.map(row => ({
      ...JSON.parse(row.configJson),
      id: row.id,
      createdAt: row.createdAt
    }));

    res.json(configs);
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Konfigurationen:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Konfiguration nach ID abrufen
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const row = await dbGet<{
      id: number;
      name: string;
      resource_type: string;
      cloud_provider: string | null;
      environment: string | null;
      config_json: string;
      is_default: boolean;
      created_at: string;
    }>(
      db,
      `SELECT id, name, resource_type, cloud_provider, environment, config_json, is_default, created_at
       FROM naming_configs WHERE id = ?`,
      [req.params.id]
    );

    if (!row) {
      return res.status(404).json({ error: 'Konfiguration nicht gefunden' });
    }

    const config: NamingConfig = {
      ...JSON.parse(row.config_json),
      id: row.id,
      createdAt: row.created_at
    };

    res.json(config);
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Konfiguration:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Neue Konfiguration speichern
router.post('/', async (req, res) => {
  try {
    const config: NamingConfig = req.body;

    if (!config.name || !config.resourceType) {
      return res.status(400).json({ error: 'name und resourceType sind erforderlich' });
    }

    const db = getDatabase();
    const result = await dbRun(
      db,
      `INSERT INTO naming_configs (name, resource_type, cloud_provider, environment, config_json, is_default)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        config.name,
        config.resourceType,
        config.cloudProvider || null,
        config.environment || null,
        JSON.stringify(config),
        config.isDefault ? 1 : 0
      ]
    );

    const created = await dbGet<{ id: number; created_at: string }>(
      db,
      `SELECT id, created_at FROM naming_configs WHERE id = ?`,
      [result.lastID]
    );

    res.status(201).json({
      ...config,
      id: result.lastID,
      createdAt: created?.created_at
    });
  } catch (error: any) {
    console.error('Fehler beim Speichern der Konfiguration:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Konfiguration aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const config: NamingConfig = req.body;
    const id = parseInt(req.params.id);

    if (!config.name || !config.resourceType) {
      return res.status(400).json({ error: 'name und resourceType sind erforderlich' });
    }

    const db = getDatabase();
    await dbRun(
      db,
      `UPDATE naming_configs 
       SET name = ?, resource_type = ?, cloud_provider = ?, environment = ?, config_json = ?, is_default = ?
       WHERE id = ?`,
      [
        config.name,
        config.resourceType,
        config.cloudProvider || null,
        config.environment || null,
        JSON.stringify(config),
        config.isDefault ? 1 : 0,
        id
      ]
    );

    const updated = await dbGet<{ created_at: string }>(
      db,
      `SELECT created_at FROM naming_configs WHERE id = ?`,
      [id]
    );

    res.json({
      ...config,
      id,
      createdAt: updated?.created_at
    });
  } catch (error: any) {
    console.error('Fehler beim Aktualisieren der Konfiguration:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Konfiguration löschen
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const result = await dbRun(
      db,
      'DELETE FROM naming_configs WHERE id = ?',
      [req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Konfiguration nicht gefunden' });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen der Konfiguration:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;

