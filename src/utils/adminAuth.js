/**
 * Admin Authentication Helpers
 * Shared utilities for admin panel authentication
 */

import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

// Check if user has valid session
export const isTokenValid = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
};

// Synchronous check using localStorage (for quick checks)
export const isTokenValidSync = () => {
    const token = localStorage.getItem('dani_admin_token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch (e) {
        return false;
    }
};

// Handle auth errors and redirect to login
export const handleAuthError = (error, navigate) => {
    if (error?.status === 401 || error?.message?.includes('JWT')) {
        localStorage.removeItem('dani_admin_token');
        toast.error('Sessão expirada. Por favor faça login novamente.');
        if (navigate) {
            navigate('/admin');
        } else {
            window.location.href = '/admin';
        }
        return true;
    }
    return false;
};

// Clear token and redirect to login
export const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('dani_admin_token');
    window.location.href = '/admin';
};

// Check authentication and redirect if needed
export const requireAuth = async (navigate) => {
    const isValid = await isTokenValid();
    if (!isValid) {
        localStorage.removeItem('dani_admin_token');
        toast.error('Por favor faça login para continuar.');
        navigate('/admin');
        return false;
    }
    return true;
};
