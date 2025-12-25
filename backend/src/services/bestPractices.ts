import { BestPracticeRule, CloudProvider, ResourceType } from '../../../shared/types.js';
import { getDatabase, dbRun, dbGet, dbAll } from '../database/init.js';

// Best Practices Daten als Fallback (wenn DB leer ist)
const DEFAULT_BEST_PRACTICES: BestPracticeRule[] = [
  // Azure Best Practices
  {
    provider: 'azure',
    resourceType: 'vm',
    maxLength: 15,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'location', 'resource', 'instance'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-weu-vm-web-01', 'dev-eus-vm-db-02'],
    notes: 'Azure VMs: Max 15 Zeichen, nur Kleinbuchstaben, Zahlen und Bindestriche'
  },
  {
    provider: 'azure',
    resourceType: 'storage',
    maxLength: 24,
    allowedChars: 'a-z0-9',
    recommendedComponents: ['env', 'location', 'resource', 'purpose'],
    separator: '',
    caseStyle: 'lowercase',
    examples: ['prodweustorageweb', 'devstoragebackup'],
    notes: 'Azure Storage Accounts: Max 24 Zeichen, nur Kleinbuchstaben und Zahlen, keine Bindestriche'
  },
  {
    provider: 'azure',
    resourceType: 'network',
    maxLength: 80,
    allowedChars: 'a-z0-9-_.',
    recommendedComponents: ['env', 'location', 'resource', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-weu-vnet-core', 'dev-eus-subnet-frontend'],
    notes: 'Azure Netzwerk-Ressourcen: Max 80 Zeichen'
  },
  {
    provider: 'azure',
    resourceType: 'resource-group',
    maxLength: 90,
    allowedChars: 'a-z0-9-_.()',
    recommendedComponents: ['env', 'location', 'application', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-weu-rg-webapp', 'dev-eus-rg-testing'],
    notes: 'Azure Resource Groups: Max 90 Zeichen'
  },
  // AWS Best Practices
  {
    provider: 'aws',
    resourceType: 'vm',
    maxLength: 255,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'application', 'resource', 'instance'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-ec2-01', 'dev-api-ec2-02'],
    notes: 'AWS EC2: Tags verwenden für bessere Organisation'
  },
  {
    provider: 'aws',
    resourceType: 'storage',
    maxLength: 63,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'application', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-logs', 'dev-backup-data'],
    notes: 'AWS S3 Buckets: Max 63 Zeichen, global eindeutig'
  },
  {
    provider: 'aws',
    resourceType: 'network',
    maxLength: 255,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'application', 'resource', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-vpc', 'dev-api-subnet-public'],
    notes: 'AWS Netzwerk-Ressourcen: Tags für Organisation verwenden'
  },
  {
    provider: 'aws',
    resourceType: 'database',
    maxLength: 63,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'application', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-db', 'dev-api-db'],
    notes: 'AWS RDS: Max 63 Zeichen'
  },
  {
    provider: 'aws',
    resourceType: 'function',
    maxLength: 64,
    allowedChars: 'a-z0-9-_',
    recommendedComponents: ['env', 'application', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-process', 'dev-api-handler'],
    notes: 'AWS Lambda: Max 64 Zeichen'
  },
  // GCP Best Practices
  {
    provider: 'gcp',
    resourceType: 'vm',
    maxLength: 63,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'application', 'resource', 'instance'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-vm-01', 'dev-api-vm-02'],
    notes: 'GCP Compute Engine: Max 63 Zeichen'
  },
  {
    provider: 'gcp',
    resourceType: 'storage',
    maxLength: 63,
    allowedChars: 'a-z0-9-_.',
    recommendedComponents: ['env', 'application', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-logs', 'dev-backup-data'],
    notes: 'GCP Cloud Storage: Max 63 Zeichen, global eindeutig'
  },
  {
    provider: 'gcp',
    resourceType: 'network',
    maxLength: 63,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'application', 'resource', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-vpc', 'dev-api-subnet'],
    notes: 'GCP VPC: Max 63 Zeichen'
  },
  {
    provider: 'gcp',
    resourceType: 'database',
    maxLength: 63,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['env', 'application', 'purpose'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['prod-webapp-db', 'dev-api-db'],
    notes: 'GCP Cloud SQL: Max 63 Zeichen'
  },
  // On-Premise Best Practices
  {
    provider: 'on-premise',
    resourceType: 'server',
    maxLength: 15,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['location', 'department', 'purpose', 'instance'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['fra-it-web-01', 'muc-hr-files-02'],
    notes: 'On-Premise Server: Kurze, prägnante Namen empfohlen'
  },
  {
    provider: 'on-premise',
    resourceType: 'network',
    maxLength: 32,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['location', 'purpose', 'vlan'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['fra-core-vlan10', 'muc-guest-vlan20'],
    notes: 'On-Premise Netzwerk: VLAN-Nummern können enthalten sein'
  },
  {
    provider: 'on-premise',
    resourceType: 'client',
    maxLength: 15,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['location', 'department', 'user', 'instance'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['fra-it-pc-001', 'muc-sales-lap-042'],
    notes: 'On-Premise Clients: Oft mit Benutzer- oder Abteilungsbezug'
  },
  {
    provider: 'on-premise',
    resourceType: 'hardware',
    maxLength: 20,
    allowedChars: 'a-z0-9-',
    recommendedComponents: ['location', 'type', 'purpose', 'instance'],
    separator: '-',
    caseStyle: 'lowercase',
    examples: ['fra-switch-core-01', 'muc-router-edge-02'],
    notes: 'On-Premise Hardware: Typ und Standort wichtig'
  }
];

export class BestPracticesService {
  static async initializeDefaults(): Promise<void> {
    const db = getDatabase();
    
    for (const rule of DEFAULT_BEST_PRACTICES) {
      try {
        await dbRun(
          db,
          `INSERT OR IGNORE INTO best_practices (provider, resource_type, rules_json, examples)
           VALUES (?, ?, ?, ?)`,
          [
            rule.provider,
            rule.resourceType,
            JSON.stringify(rule),
            JSON.stringify(rule.examples)
          ]
        );
      } catch (error) {
        console.error(`Fehler beim Einfügen von Best Practice für ${rule.provider}/${rule.resourceType}:`, error);
      }
    }
    console.log('Best Practices initialisiert');
  }

  static async getBestPractice(
    provider: CloudProvider,
    resourceType: ResourceType
  ): Promise<BestPracticeRule | null> {
    const db = getDatabase();
    const row = await dbGet<{ rules_json: string }>(
      db,
      `SELECT rules_json FROM best_practices WHERE provider = ? AND resource_type = ?`,
      [provider, resourceType]
    );

    if (row) {
      return JSON.parse(row.rules_json) as BestPracticeRule;
    }

    // Fallback zu Default-Daten
    const defaultRule = DEFAULT_BEST_PRACTICES.find(
      r => r.provider === provider && r.resourceType === resourceType
    );

    return defaultRule || null;
  }

  static async getAllBestPractices(): Promise<BestPracticeRule[]> {
    const db = getDatabase();
    const rows = await dbAll<{ rules_json: string }>(
      db,
      `SELECT rules_json FROM best_practices ORDER BY provider, resource_type`
    );

    if (rows.length > 0) {
      return rows.map(row => JSON.parse(row.rules_json) as BestPracticeRule);
    }

    // Fallback zu Default-Daten
    return DEFAULT_BEST_PRACTICES;
  }

  static async getBestPracticesByProvider(provider: CloudProvider): Promise<BestPracticeRule[]> {
    const db = getDatabase();
    const rows = await dbAll<{ rules_json: string }>(
      db,
      `SELECT rules_json FROM best_practices WHERE provider = ? ORDER BY resource_type`,
      [provider]
    );

    if (rows.length > 0) {
      return rows.map(row => JSON.parse(row.rules_json) as BestPracticeRule);
    }

    // Fallback zu Default-Daten
    return DEFAULT_BEST_PRACTICES.filter(r => r.provider === provider);
  }
}

