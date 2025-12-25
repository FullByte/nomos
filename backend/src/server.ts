import express from 'express';
import cors from 'cors';
import { initDatabase, getDatabase } from './database/init.js';
import { BestPracticesService } from './services/bestPractices.js';
import namingRoutes from './routes/naming.js';
import configRoutes from './routes/config.js';
import namesRoutes from './routes/names.js';
import apiKeysRoutes from './routes/apiKeys.js';
import { ResourceType, CloudProvider } from '../../shared/types.js';
import { setupSwagger } from './swagger.js';
import { requireApiKey } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS konfigurieren
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Resource Types Endpoint (erfordert API-Key)
app.get('/api/resource-types', requireApiKey, (req, res) => {
  const resourceTypes: ResourceType[] = [
    'vm',
    'storage',
    'network',
    'database',
    'load-balancer',
    'firewall',
    'vpn',
    'client',
    'server',
    'hardware',
    'resource-group',
    'function',
    'container',
    'kubernetes',
    'other'
  ];
  res.json(resourceTypes);
});

// Cloud Providers Endpoint (erfordert API-Key)
app.get('/api/cloud-providers', requireApiKey, (req, res) => {
  const providers: CloudProvider[] = ['azure', 'aws', 'gcp', 'on-premise'];
  res.json(providers);
});

// Best Practices Endpoint (erfordert API-Key)
app.get('/api/best-practices', requireApiKey, async (req, res) => {
  try {
    const { provider, resourceType } = req.query;

    if (provider && resourceType) {
      const bestPractice = await BestPracticesService.getBestPractice(
        provider as CloudProvider,
        resourceType as ResourceType
      );
      if (!bestPractice) {
        return res.status(404).json({ error: 'Best Practice nicht gefunden' });
      }
      return res.json(bestPractice);
    }

    if (provider) {
      const practices = await BestPracticesService.getBestPracticesByProvider(provider as CloudProvider);
      return res.json(practices);
    }

    const allPractices = await BestPracticesService.getAllBestPractices();
    res.json(allPractices);
  } catch (error: any) {
    console.error('Fehler beim Abrufen der Best Practices:', error);
    res.status(500).json({ error: error.message || 'Interner Serverfehler' });
  }
});

// API Routes (alle erfordern API-Key außer Health Check und initial API-Key)
app.use('/api/keys', apiKeysRoutes);
app.use('/api/generate', requireApiKey, namingRoutes);
app.use('/api/validate', requireApiKey, namingRoutes);
app.use('/api/configs', requireApiKey, configRoutes);
app.use('/api/names', requireApiKey, namesRoutes);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unbehandelter Fehler:', err);
  res.status(500).json({ error: 'Interner Serverfehler' });
});

// Server starten
async function startServer() {
  try {
    // Datenbank initialisieren
    await initDatabase();
    
    // Best Practices initialisieren
    await BestPracticesService.initializeDefaults();

    // Swagger/OpenAPI Dokumentation
    setupSwagger(app);

    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
      console.log(`API verfügbar unter http://localhost:${PORT}/api`);
      console.log(`API-Dokumentation verfügbar unter http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Fehler beim Starten des Servers:', error);
    process.exit(1);
  }
}

startServer();

