import axios from 'axios';
import { mockVehicles, mockCampaigns, mockContacts } from './mockData';

// Configuração da API - URLs relativas para serverless
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';
const API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

// Flag para controlar se estamos em modo mock
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK === 'true';

console.log('API Configuration:', { apiUrl: API_URL, useMock: USE_MOCK_DATA });

// Helper para simular delay de rede
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ==============================================
// VEHICLES API
// ==============================================

export const vehiclesAPI = {
  // Listar todas as viaturas com filtros opcionais
  getAll: async (params = {}) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      let filtered = [...mockVehicles];
      
      if (params.brand) {
        filtered = filtered.filter(v => v.brand === params.brand);
      }
      if (params.fuel_type) {
        filtered = filtered.filter(v => v.fuel_type === params.fuel_type);
      }
      if (params.min_year) {
        filtered = filtered.filter(v => v.year >= parseInt(params.min_year));
      }
      if (params.max_price) {
        filtered = filtered.filter(v => v.price <= parseInt(params.max_price));
      }
      
      return filtered;
    }
    
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_URL}/vehicles${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url, { timeout: 8000 });
      
      // Validação: garantir que é um array
      if (!Array.isArray(response.data)) {
        console.warn('API retornou dados inválidos, usando mock data');
        return mockVehicles;
      }
      
      return response.data;
    } catch (error) {
      console.warn('Erro ao buscar viaturas, usando mock data:', error.message);
      return mockVehicles;
    }
  },

  // Obter detalhes de uma viatura específica
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const vehicle = mockVehicles.find(v => v.id === id);
      if (!vehicle) throw new Error('Viatura não encontrada');
      return vehicle;
    }
    
    try {
      const response = await axios.get(`${API_URL}/vehicles/${id}`, { timeout: 8000 });
      
      // Validação: garantir que retornou um objeto válido
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Dados inválidos');
      }
      
      return response.data;
    } catch (error) {
      console.warn(`Erro ao buscar viatura ${id}, usando mock data:`, error.message);
      const vehicle = mockVehicles.find(v => v.id === id);
      if (!vehicle) throw new Error('Viatura não encontrada');
      return vehicle;
    }
  },

  // Criar nova viatura (apenas admin)
  create: async (data) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { ...data, id: String(Date.now()) };
    }
    
    try {
      const response = await axios.post(`${API_URL}/vehicles`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar viatura:', error);
      throw error;
    }
  },

  // Atualizar viatura (apenas admin)
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { ...data, id };
    }
    
    try {
      const response = await axios.put(`${API_URL}/vehicles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar viatura:', error);
      throw error;
    }
  },

  // Deletar viatura (apenas admin)
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { message: 'Viatura removida com sucesso' };
    }
    
    try {
      const response = await axios.delete(`${API_URL}/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar viatura:', error);
      throw error;
    }
  }
};

// ==============================================
// CAMPAIGNS API
// ==============================================

export const campaignsAPI = {
  // Listar todas as campanhas
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return mockCampaigns;
    }
    
    try {
      const response = await axios.get(`${API_URL}/campaigns`, { timeout: 8000 });
      
      // Validação: garantir que é um array
      if (!Array.isArray(response.data)) {
        console.warn('API retornou dados inválidos, usando mock data');
        return mockCampaigns;
      }
      
      return response.data;
    } catch (error) {
      console.warn('Erro ao buscar campanhas, usando mock data:', error.message);
      return mockCampaigns;
    }
  },

  // Obter detalhes de uma campanha específica
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      const campaign = mockCampaigns.find(c => c.id === id);
      if (!campaign) throw new Error('Campanha não encontrada');
      return campaign;
    }
    
    try {
      const response = await axios.get(`${API_URL}/campaigns/${id}`, { timeout: 8000 });
      
      // Validação
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Dados inválidos');
      }
      
      return response.data;
    } catch (error) {
      console.warn(`Erro ao buscar campanha ${id}, usando mock data:`, error.message);
      const campaign = mockCampaigns.find(c => c.id === id);
      if (!campaign) throw new Error('Campanha não encontrada');
      return campaign;
    }
  },

  // Criar nova campanha (apenas admin)
  create: async (data) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { ...data, id: String(Date.now()) };
    }
    
    try {
      const response = await axios.post(`${API_URL}/campaigns`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  },

  // Atualizar campanha (apenas admin)
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { ...data, id };
    }
    
    try {
      const response = await axios.put(`${API_URL}/campaigns/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      throw error;
    }
  },

  // Deletar campanha (apenas admin)
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { message: 'Campanha removida com sucesso' };
    }
    
    try {
      const response = await axios.delete(`${API_URL}/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      throw error;
    }
  }
};

// ==============================================
// CONTACTS API
// ==============================================

export const contactsAPI = {
  // Criar novo contacto
  create: async (data) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { ...data, id: String(Date.now()), status: 'new', created_at: new Date().toISOString() };
    }
    
    try {
      const response = await axios.post(`${API_URL}/contacts`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar contacto:', error);
      throw error;
    }
  },

  // Listar todos os contactos (apenas admin)
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return mockContacts;
    }
    
    try {
      const response = await axios.get(`${API_URL}/contacts`);
      
      // Validação
      if (!Array.isArray(response.data)) {
        console.warn('API retornou dados inválidos, usando mock data');
        return mockContacts;
      }
      
      return response.data;
    } catch (error) {
      console.warn('Erro ao buscar contactos, usando mock data:', error.message);
      return mockContacts;
    }
  }
};

// ==============================================
// UPLOAD API
// ==============================================

export const uploadAPI = {
  // Upload de imagem de viatura
  uploadVehicleImage: async (file) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800' };
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/upload/vehicle-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  },

  // Upload de imagem de campanha
  uploadCampaignImage: async (file) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800' };
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/upload/campaign-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  }
};

// ==============================================
// AUTH API
// ==============================================

export const authAPI = {
  // Login de admin
  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      if (email === 'admin@dani.pt' && password === 'admin123') {
        return {
          access_token: 'mock_token_' + Date.now(),
          token_type: 'bearer',
          user: { email: 'admin@dani.pt', role: 'admin' }
        };
      }
      throw new Error('Credenciais inválidas');
    }
    
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    // Limpar token do localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Obter token
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Salvar token
  saveToken: (token) => {
    localStorage.setItem('auth_token', token);
  }
};

// ==============================================
// NEWSLETTER API
// ==============================================

export const newsletterAPI = {
  // Subscrever newsletter
  subscribe: async (email) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { id: String(Date.now()), email, is_active: true };
    }
    
    try {
      const response = await axios.post(`${API_URL}/newsletter`, { email });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Este email já está subscrito.');
      }
      throw error;
    }
  },

  // Cancelar subscrição
  unsubscribe: async (email) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { message: 'Subscrição cancelada com sucesso.', found: true };
    }
    
    try {
      const response = await axios.post(`${API_URL}/newsletter/unsubscribe`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar se está subscrito
  checkSubscription: async (email) => {
    if (USE_MOCK_DATA) {
      await simulateDelay();
      return { subscribed: false, found: false };
    }
    
    try {
      const response = await axios.get(`${API_URL}/newsletter/check/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      return { subscribed: false, found: false };
    }
  }
};

// Configurar interceptor para adicionar token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = authAPI.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export default com todas as APIs
export default {
  vehicles: vehiclesAPI,
  campaigns: campaignsAPI,
  contacts: contactsAPI,
  upload: uploadAPI,
  auth: authAPI,
  newsletter: newsletterAPI
};
