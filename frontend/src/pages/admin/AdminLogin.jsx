import React, { useState } from 'react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            toast.success('Login efetuado com sucesso!');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error('Credenciais inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img 
                        src={LOGO_URL} 
                        alt="dANI.PT" 
                        className="h-12 w-auto mx-auto object-contain"
                    />
                    <p className="text-[#666666] mt-4">Painel de Administração</p>
                </div>

                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-8">
                    <h2 className="font-archivo font-bold text-xl text-[#1A1A1A] mb-6">
                        Iniciar Sessão
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                                placeholder="admin@dani.pt"
                                data-testid="admin-email-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                                placeholder="••••••••"
                                data-testid="admin-password-input"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#E60000] hover:bg-[#CC0000] text-white font-semibold rounded-[2px] transition-colors mt-6"
                            data-testid="admin-login-btn"
                        >
                            {loading ? 'A entrar...' : 'Entrar'}
                        </button>
                    </form>

                    <p className="text-xs text-[#999999] text-center mt-6">
                        Credenciais de teste: admin@dani.pt / admin123
                    </p>
                </div>
            </div>
        </main>
    );
};
