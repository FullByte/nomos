import { Request, Response, NextFunction } from 'express';
import { ApiKeyModel } from '../models/apiKey.js';

export async function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string || req.query.apiKey as string;

  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API-Key erforderlich',
      message: 'Bitte geben Sie einen API-Key im Header "X-API-Key" oder als Query-Parameter "apiKey" an.'
    });
  }

  const keyRecord = await ApiKeyModel.findByKey(apiKey);

  if (!keyRecord) {
    return res.status(401).json({ 
      error: 'Ungültiger API-Key',
      message: 'Der angegebene API-Key ist ungültig oder wurde deaktiviert.'
    });
  }

  // Update last used timestamp
  await ApiKeyModel.updateLastUsed(apiKey);

  // Füge Key-Informationen zum Request hinzu (optional, für Logging)
  (req as any).apiKey = keyRecord;

  next();
}


