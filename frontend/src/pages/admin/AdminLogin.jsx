/**
 * Admin Login Page
 * 
 * TODO: Implementar autenticação JWT completa
 * TODO: Adicionar validação de formulário com Zod
 * TODO: Implementar "Esqueci a password"
 * TODO: Adicionar rate limiting para tentativas de login
 * 
 * Credenciais de teste: admin@dani.pt / admin123
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png";

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem('dani_admin_token')) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, { 
                email, 
                password 
            });
            
            // Store token
            localStorage.setItem('dani_admin_token', response.data.token);
            
            toast.success('Login efetuado com sucesso!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Credenciais inválidas. Tente: admin@dani.pt / admin123');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img 
                        src={LOGO_URL} 
                        alt="dANI.PT" 
                        className="h-12 w-auto mx-auto object-contain"
                    />
                    <p className="text-[#666666] mt-4 text-sm">Painel de Administração</p>
                </div>

                {/* Login Form */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-8">
                    <h1 className="font-bold text-xl text-[#1A1A1A] mb-6">
                        Iniciar Sessão
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5" data-testid="admin-login-form">
                        {/* Email */}
                        <div>
                            <label 
                                htmlFor="email"
                                className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                                placeholder="admin@dani.pt"
                                data-testid="admin-email-input"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label 
                                htmlFor="password"
                                className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                                placeholder="••••••••"
                                data-testid="admin-password-input"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-[#999999] text-white font-semibold rounded-[2px] transition-colors mt-2"
                            data-testid="admin-login-btn"
                        >
                            {loading ? 'A entrar...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Test Credentials Notice */}
                    <div className="mt-6 p-3 bg-[#F4F4F4] rounded-[2px]">
                        <p className="text-xs text-[#666666] text-center">
                            <strong>Credenciais de teste:</strong><br />
                            Email: admin@dani.pt<br />
                            Password: admin123
                        </p>
                    </div>
                </div>

                {/* Back to site */}
                <p className="text-center mt-6">
                    <a href="/" className="text-sm text-[#666666] hover:text-[#E60000] transition-colors">
                        ← Voltar ao site
                    </a>
                </p>
            </div>
        </main>
    );
};
