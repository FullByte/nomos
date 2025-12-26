import axios from 'axios';
import type {
  ResourceType,
  CloudProvider,
  GenerateNameRequest,
  GenerateNameResponse,
  ValidateNameRequest,
  ValidateNameResponse,
  NamingConfig,
  NameRecord,
  BestPracticeRule
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor für Fehlerbehandlung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Wenn die Antwort ein Fehler ist, logge es und re-throw
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  // Resource Types
  getResourceTypes: async (): Promise<ResourceType[]> => {
    const response = await api.get<ResourceType[]>('/resource-types');
    return response.data;
  },

  // Cloud Providers
  getCloudProviders: async (): Promise<CloudProvider[]> => {
    const response = await api.get<CloudProvider[]>('/cloud-providers');
    return response.data;
  },

  // Best Practices
  getBestPractices: async (provider?: CloudProvider, resourceType?: ResourceType): Promise<BestPracticeRule[]> => {
    const params: any = {};
    if (provider) params.provider = provider;
    if (resourceType) params.resourceType = resourceType;
    
    const response = await api.get<BestPracticeRule[]>('/best-practices', { params });
    return response.data;
  },

  getBestPractice: async (provider: CloudProvider, resourceType: ResourceType): Promise<BestPracticeRule | null> => {
    const response = await api.get<BestPracticeRule>('/best-practices', {
      params: { provider, resourceType }
    });
    return response.data;
  },

  // Name Generation
  generateNames: async (request: GenerateNameRequest): Promise<GenerateNameResponse> => {
    const response = await api.post<GenerateNameResponse>('/generate', request);
    return response.data;
  },

  // Name Validation
  validateName: async (request: ValidateNameRequest): Promise<ValidateNameResponse> => {
    const response = await api.post<ValidateNameResponse>('/validate', request);
    return response.data;
  },

  // Configs
  getConfigs: async (resourceType?: ResourceType, cloudProvider?: CloudProvider): Promise<NamingConfig[]> => {
    const params: any = {};
    if (resourceType) params.resourceType = resourceType;
    if (cloudProvider) params.cloudProvider = cloudProvider;
    
    const response = await api.get<NamingConfig[]>('/configs', { params });
    return response.data;
  },

  getConfig: async (id: number): Promise<NamingConfig> => {
    const response = await api.get<NamingConfig>(`/configs/${id}`);
    return response.data;
  },

  saveConfig: async (config: NamingConfig): Promise<NamingConfig> => {
    const response = await api.post<NamingConfig>('/configs', config);
    return response.data;
  },

  updateConfig: async (id: number, config: NamingConfig): Promise<NamingConfig> => {
    const response = await api.put<NamingConfig>(`/configs/${id}`, config);
    return response.data;
  },

  deleteConfig: async (id: number): Promise<void> => {
    await api.delete(`/configs/${id}`);
  },

  // Names
  getNames: async (filters?: {
    resourceType?: ResourceType;
    cloudProvider?: CloudProvider;
    environment?: string;
  }): Promise<NameRecord[]> => {
    const response = await api.get<NameRecord[]>('/names', { params: filters });
    return response.data;
  },

  getName: async (id: number): Promise<NameRecord> => {
    const response = await api.get<NameRecord>(`/names/${id}`);
    return response.data;
  },

  addName: async (record: Omit<NameRecord, 'id' | 'createdAt'>): Promise<NameRecord> => {
    const response = await api.post<NameRecord>('/names', record);
    return response.data;
  },

  updateName: async (id: number, record: Partial<NameRecord>): Promise<NameRecord> => {
    const response = await api.put<NameRecord>(`/names/${id}`, record);
    return response.data;
  },

  deleteName: async (id: number): Promise<void> => {
    await api.delete(`/names/${id}`);
  },
};

