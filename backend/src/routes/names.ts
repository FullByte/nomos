import { Router } from 'express';
import { NameRecordModel } from '../models/nameRecord.js';
import { ResourceType, CloudProvider, Environment } from '../../../shared/types.js';

const router = Router();

// Alle Namen abrufen
router.get('/', async (req, res) => {
  try {
    const filters: {
      resourceType?: ResourceType;
      cloudProvider?: CloudProvider;
      environment?: Environment;
    } = {};

    if (req.query.resourceType) {
      filters.resourceType = req.query.resourceType as ResourceType;
    }
    if (req.query.cloudProvider) {
      filters.cloudProvider = req.query.cloudProvider as CloudProvider;
    }
    if (req.query.environment) {
      filters.environment = req.query.environment as Environment;
    }

    const names = await NameRecordModel.getAll(filters);
    res.json(names);
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Namen:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Namen nach ID abrufen
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const name = await NameRecordModel.getById(id);

    if (!name) {
      return res.status(404).json({ error: 'Name nicht gefunden' });
    }

    res.json(name);
  } catch (error: any) {
    console.error('Fehler beim Abrufen des Namens:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Neuen Namen hinzufügen
router.post('/', async (req, res) => {
  try {
    const { name, resourceType, environment, cloudProvider } = req.body;

    if (!name || !resourceType) {
      return res.status(400).json({ error: 'name und resourceType sind erforderlich' });
    }

    const record = await NameRecordModel.create({
      name,
      resourceType,
      environment,
      cloudProvider
    });

    res.status(201).json(record);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Name existiert bereits' });
    }
    console.error('Fehler beim Hinzufügen des Namens:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Namen aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, resourceType, environment, cloudProvider } = req.body;

    // Prüfen ob Name existiert
    const existing = await NameRecordModel.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Name nicht gefunden' });
    }

    // Löschen und neu erstellen (SQLite hat kein UPDATE mit UNIQUE constraint handling)
    await NameRecordModel.delete(id);
    const updated = await NameRecordModel.create({
      name: name || existing.name,
      resourceType: resourceType || existing.resourceType,
      environment: environment || existing.environment,
      cloudProvider: cloudProvider || existing.cloudProvider
    });

    res.json(updated);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Name existiert bereits' });
    }
    console.error('Fehler beim Aktualisieren des Namens:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Namen löschen
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await NameRecordModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Name nicht gefunden' });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen des Namens:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;

