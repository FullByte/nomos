// Gemeinsame TypeScript-Typen für Frontend und Backend

export type CloudProvider = 'azure' | 'aws' | 'gcp' | 'on-premise';

export type Environment = 'dev' | 'test' | 'staging' | 'prod';

export type ResourceType =
  | 'vm'
  | 'storage'
  | 'network'
  | 'database'
  | 'load-balancer'
  | 'firewall'
  | 'vpn'
  | 'client'
  | 'server'
  | 'hardware'
  | 'resource-group'
  | 'function'
  | 'container'
  | 'kubernetes'
  | 'other';

export interface NamingComponent {
  name: string;
  value: string;
  required: boolean;
  maxLength?: number;
  allowedChars?: string;
  examples?: string[];
}

export interface NamingConfig {
  id?: number;
  name: string;
  resourceType: ResourceType;
  cloudProvider?: CloudProvider;
  environment?: Environment;
  components: NamingComponent[];
  separator: string;
  prefix?: string;
  suffix?: string;
  maxTotalLength?: number;
  caseStyle: 'lowercase' | 'uppercase' | 'camelCase' | 'PascalCase' | 'kebab-case';
  isDefault?: boolean;
}

export interface BestPracticeRule {
  provider: CloudProvider;
  resourceType: ResourceType;
  maxLength: number;
  allowedChars: string;
  recommendedComponents: string[];
  separator: string;
  caseStyle: 'lowercase' | 'uppercase' | 'camelCase' | 'PascalCase' | 'kebab-case';
  examples: string[];
  notes?: string;
}

export interface NameRecord {
  id?: number;
  name: string;
  resourceType: ResourceType;
  environment?: Environment;
  cloudProvider?: CloudProvider;
  createdAt?: string;
}

export interface GenerateNameRequest {
  resourceType: ResourceType;
  cloudProvider?: CloudProvider;
  environment?: Environment;
  components: Record<string, string>;
  configId?: number;
  customConfig?: Partial<NamingConfig>;
}

export interface GenerateNameResponse {
  names: string[];
  config: NamingConfig;
  warnings?: string[];
}

export interface ValidateNameRequest {
  name: string;
  resourceType: ResourceType;
  cloudProvider?: CloudProvider;
  configId?: number;
}

export interface ValidateNameResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  matchesConfig?: boolean;
  isDuplicate?: boolean;
}

