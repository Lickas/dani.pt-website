import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

export const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
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
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="font-archivo font-black text-3xl text-[#1A1A1A]">
                        dANI<span className="text-[#E60000]">.PT</span>
                    </h1>
                    <p className="text-[#666666] mt-2">Painel de Administração</p>
                </div>

                {/* Form */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-8">
                    <h2 className="font-archivo font-bold text-xl text-[#1A1A1A] mb-6">
                        Iniciar Sessão
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="rounded-[2px] border-[#E5E5E5] focus:border-[#1A1A1A]"
                                placeholder="admin@dani.pt"
                                data-testid="admin-email-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Password
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="rounded-[2px] border-[#E5E5E5] focus:border-[#1A1A1A]"
                                placeholder="••••••••"
                                data-testid="admin-password-input"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white rounded-[2px] font-semibold mt-6"
                            data-testid="admin-login-btn"
                        >
                            {loading ? 'A entrar...' : 'Entrar'}
                        </Button>
                    </form>

                    <p className="text-xs text-[#999999] text-center mt-6">
                        Credenciais de teste: admin@dani.pt / admin123
                    </p>
                </div>
            </div>
        </main>
    );
};
