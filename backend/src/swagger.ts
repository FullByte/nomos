import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nomos API',
      version: '1.0.0',
      description: 'Nomos API - Enforces naming rules. API zur Validierung und Durchsetzung von IT-Ressourcen-Namensregeln basierend auf Best Practices',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Resource Types', description: 'Ressourcentypen' },
      { name: 'Cloud Providers', description: 'Cloud-Provider' },
      { name: 'Best Practices', description: 'Best Practices' },
      { name: 'Name Generation', description: 'Name-Generierung' },
      { name: 'Name Validation', description: 'Name-Validierung' },
      { name: 'Configurations', description: 'Naming-Konfigurationen' },
      { name: 'Names', description: 'Verwendete Namen' },
    ],
    components: {
      schemas: {
        ResourceType: {
          type: 'string',
          enum: ['vm', 'storage', 'network', 'database', 'load-balancer', 'firewall', 'vpn', 'client', 'server', 'hardware', 'resource-group', 'function', 'container', 'kubernetes', 'other'],
        },
        CloudProvider: {
          type: 'string',
          enum: ['azure', 'aws', 'gcp', 'on-premise'],
        },
        Environment: {
          type: 'string',
          enum: ['dev', 'test', 'staging', 'prod'],
        },
        NamingComponent: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            value: { type: 'string' },
            required: { type: 'boolean' },
            maxLength: { type: 'number' },
            allowedChars: { type: 'string' },
            examples: { type: 'array', items: { type: 'string' } },
          },
        },
        NamingConfig: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            resourceType: { $ref: '#/components/schemas/ResourceType' },
            cloudProvider: { $ref: '#/components/schemas/CloudProvider' },
            environment: { $ref: '#/components/schemas/Environment' },
            components: { type: 'array', items: { $ref: '#/components/schemas/NamingComponent' } },
            separator: { type: 'string' },
            prefix: { type: 'string' },
            suffix: { type: 'string' },
            maxTotalLength: { type: 'number' },
            caseStyle: { type: 'string', enum: ['lowercase', 'uppercase', 'camelCase', 'PascalCase', 'kebab-case'] },
            isDefault: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        BestPracticeRule: {
          type: 'object',
          properties: {
            provider: { $ref: '#/components/schemas/CloudProvider' },
            resourceType: { $ref: '#/components/schemas/ResourceType' },
            maxLength: { type: 'number' },
            allowedChars: { type: 'string' },
            recommendedComponents: { type: 'array', items: { type: 'string' } },
            separator: { type: 'string' },
            caseStyle: { type: 'string' },
            examples: { type: 'array', items: { type: 'string' } },
            notes: { type: 'string' },
          },
        },
        GenerateNameRequest: {
          type: 'object',
          required: ['resourceType'],
          properties: {
            resourceType: { $ref: '#/components/schemas/ResourceType' },
            cloudProvider: { $ref: '#/components/schemas/CloudProvider' },
            environment: { $ref: '#/components/schemas/Environment' },
            components: { type: 'object', additionalProperties: { type: 'string' } },
            configId: { type: 'number' },
            customConfig: { type: 'object' },
          },
        },
        GenerateNameResponse: {
          type: 'object',
          properties: {
            names: { type: 'array', items: { type: 'string' } },
            config: { $ref: '#/components/schemas/NamingConfig' },
            warnings: { type: 'array', items: { type: 'string' } },
          },
        },
        ValidateNameRequest: {
          type: 'object',
          required: ['name', 'resourceType'],
          properties: {
            name: { type: 'string' },
            resourceType: { $ref: '#/components/schemas/ResourceType' },
            cloudProvider: { $ref: '#/components/schemas/CloudProvider' },
            configId: { type: 'number' },
          },
        },
        ValidateNameResponse: {
          type: 'object',
          properties: {
            valid: { type: 'boolean' },
            errors: { type: 'array', items: { type: 'string' } },
            warnings: { type: 'array', items: { type: 'string' } },
            matchesConfig: { type: 'boolean' },
            isDuplicate: { type: 'boolean' },
          },
        },
        NameRecord: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            resourceType: { $ref: '#/components/schemas/ResourceType' },
            environment: { $ref: '#/components/schemas/Environment' },
            cloudProvider: { $ref: '#/components/schemas/CloudProvider' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/server.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Nomos API',
  }));
}


