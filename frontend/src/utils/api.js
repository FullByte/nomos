import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const apiClient = {
    // Resource Types
    getResourceTypes: async () => {
        const response = await api.get('/resource-types');
        return response.data;
    },
    // Cloud Providers
    getCloudProviders: async () => {
        const response = await api.get('/cloud-providers');
        return response.data;
    },
    // Best Practices
    getBestPractices: async (provider, resourceType) => {
        const params = {};
        if (provider)
            params.provider = provider;
        if (resourceType)
            params.resourceType = resourceType;
        const response = await api.get('/best-practices', { params });
        return response.data;
    },
    getBestPractice: async (provider, resourceType) => {
        const response = await api.get('/best-practices', {
            params: { provider, resourceType }
        });
        return response.data;
    },
    // Name Generation
    generateNames: async (request) => {
        const response = await api.post('/generate', request);
        return response.data;
    },
    // Name Validation
    validateName: async (request) => {
        const response = await api.post('/validate', request);
        return response.data;
    },
    // Configs
    getConfigs: async (resourceType, cloudProvider) => {
        const params = {};
        if (resourceType)
            params.resourceType = resourceType;
        if (cloudProvider)
            params.cloudProvider = cloudProvider;
        const response = await api.get('/configs', { params });
        return response.data;
    },
    getConfig: async (id) => {
        const response = await api.get(`/configs/${id}`);
        return response.data;
    },
    saveConfig: async (config) => {
        const response = await api.post('/configs', config);
        return response.data;
    },
    updateConfig: async (id, config) => {
        const response = await api.put(`/configs/${id}`, config);
        return response.data;
    },
    deleteConfig: async (id) => {
        await api.delete(`/configs/${id}`);
    },
    // Names
    getNames: async (filters) => {
        const response = await api.get('/names', { params: filters });
        return response.data;
    },
    getName: async (id) => {
        const response = await api.get(`/names/${id}`);
        return response.data;
    },
    addName: async (record) => {
        const response = await api.post('/names', record);
        return response.data;
    },
    updateName: async (id, record) => {
        const response = await api.put(`/names/${id}`, record);
        return response.data;
    },
    deleteName: async (id) => {
        await api.delete(`/names/${id}`);
    },
};
