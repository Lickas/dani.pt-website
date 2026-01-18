/**
 * Admin Login Page - dANI.PT
 * Clean, modern and minimal design
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || '';
const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';
const LOGO_URL = "https://customer-assets.emergentagent.com/job_site-renovacao/artifacts/42m6k0x5_Gemini_Generated_Image_n4ngben4ngben4ng.png";

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
            const response = await axios.post(`${API_URL}/admin/login`, { 
                email, 
                password 
            });
            
            // Store token
            localStorage.setItem('dani_admin_token', response.data.token);
            
            toast.success('Login efetuado com sucesso!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Credenciais inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden">
                {/* Red accent */}
                <div className="absolute top-0 left-0 w-[3px] h-full bg-[#E60000]"></div>
                
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5" 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
                
                <div className="relative z-10 p-12 flex flex-col justify-between h-full">
                    <div>
                        <img 
                            src={LOGO_URL} 
                            alt="dANI.PT" 
                            className="h-8 w-auto brightness-0 invert"
                        />
                    </div>
                    
                    <div className="max-w-md">
                        <h2 className="font-display text-5xl xl:text-6xl text-white leading-tight">
                            Painel de<br/>
                            <span className="text-[#E60000]">Administração</span>
                        </h2>
                        <p className="mt-6 text-white/50 leading-relaxed">
                            Gerencie viaturas, campanhas e mensagens de forma simples e eficiente.
                        </p>
                    </div>
                    
                    <p className="text-white/30 text-sm">
                        © {new Date().getFullYear()} dANI.PT
                    </p>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-10">
                        <img 
                            src={LOGO_URL} 
                            alt="dANI.PT" 
                            className="h-8 w-auto mx-auto dark:brightness-0 dark:invert"
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Bem-vindo de volta
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Introduza os seus dados para aceder ao painel
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5" data-testid="admin-login-form">
                        {/* Email */}
                        <div>
                            <label 
                                htmlFor="email"
                                className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                                    placeholder="admin@dani.pt"
                                    data-testid="admin-email-input"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label 
                                htmlFor="password"
                                className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                                    placeholder="••••••••"
                                    data-testid="admin-password-input"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-semibold rounded-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                            data-testid="admin-login-btn"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    A entrar...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    {/* Test Credentials Notice */}
                    <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                            <strong className="text-gray-700 dark:text-gray-300">Credenciais de teste:</strong><br />
                            Email: <code className="text-[#E60000]">admin@dani.pt</code><br />
                            Password: <code className="text-[#E60000]">admin123</code>
                        </p>
                    </div>

                    {/* Back to site */}
                    <div className="mt-8 text-center">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Voltar ao site
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};
