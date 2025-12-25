import { Router } from 'express';
import { ApiKeyModel, ApiKeyRecord } from '../models/apiKey.js';
import { requireApiKey } from '../middleware/auth.js';

const router = Router();

// Alle API-Keys abrufen (erfordert API-Key)
router.get('/', requireApiKey, async (req, res) => {
  try {
    const keys = await ApiKeyModel.getAll();
    // Entferne keyHash aus der Antwort (Sicherheit)
    const safeKeys = keys.map(k => ({
      id: k.id,
      name: k.name,
      description: k.description,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      isActive: k.isActive
    }));
    res.json(safeKeys);
  } catch (error: any) {
    console.error('Fehler beim Abrufen der API-Keys:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// Neuen API-Key erstellen (erfordert API-Key)
router.post('/', requireApiKey, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'name ist erforderlich' });
    }

    const { key, record } = await ApiKeyModel.create(name, description);

    // Nur beim Erstellen wird der vollständige Key zurückgegeben
    res.status(201).json({
      id: record.id,
      key: key, // WICHTIG: Nur hier wird der Key zurückgegeben!
      name: record.name,
      description: record.description,
      createdAt: record.createdAt,
      warning: 'Speichern Sie diesen API-Key sicher. Er wird nicht erneut angezeigt!'
    });
  } catch (error: any) {
    console.error('Fehler beim Erstellen des API-Keys:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// API-Key deaktivieren
router.put('/:id/deactivate', requireApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await ApiKeyModel.deactivate(id);

    if (!success) {
      return res.status(404).json({ error: 'API-Key nicht gefunden' });
    }

    res.json({ message: 'API-Key wurde deaktiviert' });
  } catch (error: any) {
    console.error('Fehler beim Deaktivieren des API-Keys:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// API-Key löschen
router.delete('/:id', requireApiKey, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await ApiKeyModel.delete(id);

    if (!success) {
      return res.status(404).json({ error: 'API-Key nicht gefunden' });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Fehler beim Löschen des API-Keys:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;


