import { Router } from 'express';
import { NamingEngine } from '../services/namingEngine.js';
import { GenerateNameRequest, ValidateNameRequest } from '../../../shared/types.js';

const router = Router();

router.post('/api/generate', async (req, res) => {
  try {
    const request: GenerateNameRequest = req.body;
    
    if (!request.resourceType) {
      return res.status(400).json({ error: 'resourceType ist erforderlich' });
    }

    const response = await NamingEngine.generateNames(request);
    res.json(response);
  } catch (error: any) {
    console.error('Fehler bei Name-Generierung:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

router.post('/api/validate', async (req, res) => {
  try {
    const request: ValidateNameRequest = req.body;
    
    if (!request.name || !request.resourceType) {
      return res.status(400).json({ error: 'name und resourceType sind erforderlich' });
    }

    const response = await NamingEngine.validateName(request);
    res.json(response);
  } catch (error: any) {
    console.error('Fehler bei Name-Validierung:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

export default router;

