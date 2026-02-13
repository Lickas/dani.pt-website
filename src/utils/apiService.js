/**
 * API Service - dANI.PT
 * Direct Supabase integration (Serverless)
 */

import { supabase } from '../supabaseClient';

// ==============================================
// VEHICLES API - Supabase Direct
// ==============================================

export const vehiclesAPI = {
  // Listar todas as viaturas com filtros opcionais
  getAll: async (params = {}) => {
    try {
      let query = supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (params.brand) {
        query = query.eq('brand', params.brand);
      }
      if (params.fuel_type) {
        query = query.eq('fuel_type', params.fuel_type);
      }
      if (params.min_year) {
        query = query.gte('year', parseInt(params.min_year));
      }
      if (params.max_price) {
        query = query.lte('price', parseInt(params.max_price));
      }
      if (params.is_featured !== undefined) {
        query = query.eq('is_featured', params.is_featured);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar viaturas:', error.message);
      return [];
    }
  },

  // Obter detalhes de uma viatura específica
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar viatura ${id}:`, error.message);
      throw new Error('Viatura não encontrada');
    }
  },

  // Criar nova viatura (apenas admin)
  create: async (data) => {
    try {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return vehicle;
    } catch (error) {
      console.error('Erro ao criar viatura:', error);
      throw error;
    }
  },

  // Atualizar viatura (apenas admin)
  update: async (id, data) => {
    try {
      const { data: vehicle, error } = await supabase
        .from('vehicles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return vehicle;
    } catch (error) {
      console.error('Erro ao atualizar viatura:', error);
      throw error;
    }
  },

  // Deletar viatura (apenas admin)
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Viatura removida com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar viatura:', error);
      throw error;
    }
  }
};

// ==============================================
// CAMPAIGNS API - Supabase Direct
// ==============================================

export const campaignsAPI = {
  // Listar todas as campanhas (públicas - apenas ativas)
  getAll: async (onlyActive = true) => {
    try {
      let query = supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyActive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error.message);
      return [];
    }
  },

  // Listar todas as campanhas (admin - todas)
  getAllAdmin: async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error.message);
      return [];
    }
  },

  // Obter detalhes de uma campanha específica
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar campanha ${id}:`, error.message);
      throw new Error('Campanha não encontrada');
    }
  },

  // Criar nova campanha (apenas admin)
  create: async (data) => {
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return campaign;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  },

  // Atualizar campanha (apenas admin)
  update: async (id, data) => {
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return campaign;
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      throw error;
    }
  },

  // Deletar campanha (apenas admin)
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Campanha removida com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      throw error;
    }
  }
};

// ==============================================
// CONTACTS API - Supabase Direct
// ==============================================

export const contactsAPI = {
  // Criar novo contacto
  create: async (data) => {
    try {
      const { data: contact, error } = await supabase
        .from('contacts')
        .insert([{ ...data, status: 'new' }])
        .select()
        .single();

      if (error) throw error;
      return contact;
    } catch (error) {
      console.error('Erro ao criar contacto:', error);
      throw error;
    }
  },

  // Listar todos os contactos (apenas admin)
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar contactos:', error.message);
      return [];
    }
  },

  // Atualizar status do contacto
  updateStatus: async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar contacto:', error);
      throw error;
    }
  },

  // Deletar contacto
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Contacto removido com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar contacto:', error);
      throw error;
    }
  }
};

// ==============================================
// UPLOAD API - Supabase Storage Direct
// ==============================================

export const uploadAPI = {
  // Upload de imagem de viatura
  // Usa o bucket 'vehicle-images'
  uploadVehicleImage: async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `vehicles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  },

  // Upload de imagem de campanha
  // Usa o bucket 'campaign-images'
  uploadCampaignImage: async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `campaigns/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  },

  // Delete image from storage (genérico)
  deleteImage: async (bucket, path) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return { message: 'Imagem removida com sucesso' };
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      throw error;
    }
  }
};

// ==============================================
// AUTH API - Supabase Auth Direct
// ==============================================

export const authAPI = {
  // Login de admin usando Supabase Auth
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return {
        access_token: data.session.access_token,
        token_type: 'bearer',
        user: data.user
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('dani_admin_token');
  },

  // Verificar se está autenticado
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Obter sessão atual
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Obter utilizador atual
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Registar novo admin (apenas para setup inicial)
  register: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro no registo:', error);
      throw error;
    }
  }
};

// ==============================================
// NEWSLETTER API - Supabase Direct
// ==============================================

export const newsletterAPI = {
  // Subscrever newsletter
  subscribe: async (email) => {
    try {
      // Check if already subscribed
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id, is_active')
        .eq('email', email)
        .single();

      if (existing) {
        if (existing.is_active) {
          throw new Error('Este email já está subscrito.');
        }
        // Reactivate subscription
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Create new subscription
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.message === 'Este email já está subscrito.') {
        throw error;
      }
      console.error('Erro ao subscrever newsletter:', error);
      throw error;
    }
  },

  // Cancelar subscrição
  unsubscribe: async (email) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return { message: 'Subscrição cancelada com sucesso.', found: true };
    } catch (error) {
      console.error('Erro ao cancelar subscrição:', error);
      return { message: 'Email não encontrado.', found: false };
    }
  },

  // Verificar se está subscrito
  checkSubscription: async (email) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('is_active')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { subscribed: false, found: false };
      }

      return { subscribed: data.is_active, found: true };
    } catch (error) {
      return { subscribed: false, found: false };
    }
  },

  // Listar todos os subscritores (admin)
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar subscritores:', error.message);
      return [];
    }
  }
};

// ==============================================
// RENTING API - Supabase Direct
// ==============================================

export const rentingAPI = {
  // Listar todas as ofertas (públicas - apenas ativas)
  getAll: async (onlyActive = true) => {
    try {
      let query = supabase
        .from('renting_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyActive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar ofertas de renting:', error.message);
      return [];
    }
  },

  // Listar todas as ofertas (admin - todas)
  getAllAdmin: async () => {
    try {
      const { data, error } = await supabase
        .from('renting_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar ofertas de renting:', error.message);
      return [];
    }
  },

  // Obter detalhes de uma oferta específica
  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('renting_offers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar oferta ${id}:`, error.message);
      throw new Error('Oferta não encontrada');
    }
  },

  // Criar nova oferta (apenas admin)
  create: async (data) => {
    try {
      const { data: offer, error } = await supabase
        .from('renting_offers')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return offer;
    } catch (error) {
      console.error('Erro ao criar oferta:', error);
      throw error;
    }
  },

  // Atualizar oferta (apenas admin)
  update: async (id, data) => {
    try {
      const { data: offer, error } = await supabase
        .from('renting_offers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return offer;
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      throw error;
    }
  },

  // Deletar oferta (apenas admin)
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('renting_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Oferta removida com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar oferta:', error);
      throw error;
    }
  }
};

// Export default com todas as APIs
export default {
  vehicles: vehiclesAPI,
  campaigns: campaignsAPI,
  contacts: contactsAPI,
  upload: uploadAPI,
  auth: authAPI,
  newsletter: newsletterAPI,
  renting: rentingAPI
};
