import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

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
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        dANI<span className="text-red-600">.PT</span>
                    </h1>
                    <p className="text-gray-600 mt-2">Painel de Administração</p>
                </div>

                <div className="bg-white border border-gray-200 rounded p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Iniciar Sessão
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                                placeholder="admin@dani.pt"
                                data-testid="admin-email-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                                placeholder="••••••••"
                                data-testid="admin-password-input"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors mt-6"
                            data-testid="admin-login-btn"
                        >
                            {loading ? 'A entrar...' : 'Entrar'}
                        </button>
                    </form>

                    <p className="text-xs text-gray-500 text-center mt-6">
                        Credenciais de teste: admin@dani.pt / admin123
                    </p>
                </div>
            </div>
        </main>
    );
};
