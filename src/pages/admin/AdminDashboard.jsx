/**
 * Admin Dashboard
 * 
 * TODO: Adicionar gráficos de vendas mensais
 * TODO: Implementar widgets arrastáveis
 * TODO: Adicionar notificações em tempo real
 * TODO: Melhorar estatísticas com dados históricos
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Car, Megaphone, Mail, MailOpen, TrendingUp, Plus } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || '';
const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';

export const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentMessages, setRecentMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('dani_admin_token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [statsRes, messagesRes] = await Promise.all([
                axios.get(`${API_URL}/stats`, { headers }),
                axios.get(`${API_URL}/contacts`, { headers })
            ]);
            
            setStats(statsRes.data);
            setRecentMessages(messagesRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stat cards configuration
    const statCards = stats ? [
        {
            label: 'Viaturas Disponíveis',
            value: stats.available_vehicles,
            icon: Car,
            color: 'text-green-600 bg-green-50',
            link: '/admin/viaturas'
        },
        {
            label: 'Viaturas Vendidas',
            value: stats.sold_vehicles,
            icon: TrendingUp,
            color: 'text-blue-600 bg-blue-50',
            link: '/admin/viaturas'
        },
        {
            label: 'Campanhas Ativas',
            value: stats.active_campaigns,
            icon: Megaphone,
            color: 'text-purple-600 bg-purple-50',
            link: '/admin/campanhas'
        },
        {
            label: 'Mensagens Não Lidas',
            value: stats.unread_messages,
            icon: MailOpen,
            color: 'text-red-600 bg-red-50',
            link: '/admin/mensagens'
        }
    ] : [];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-[4px] animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                    Dashboard
                </h1>
                <p className="text-[#666666] mt-1">
                    Bem-vindo ao painel de administração dANI.PT
                </p>
            </header>

            {/* Stats Grid */}
            <section aria-label="Estatísticas">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card) => (
                        <Link
                            key={card.label}
                            to={card.link}
                            className="bg-white border border-[#E5E5E5] rounded-[4px] p-6 hover:border-[#1A1A1A] transition-colors group"
                            data-testid={`stat-${card.label.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-widest text-[#999999]">
                                        {card.label}
                                    </span>
                                    <p className="text-4xl font-bold text-[#1A1A1A] mt-2">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 rounded-[4px] flex items-center justify-center ${card.color}`}>
                                    <card.icon size={24} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section aria-label="Ações Rápidas">
                <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
                    Ações Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/viaturas/nova"
                        className="flex items-center justify-center gap-2 p-4 bg-[#E60000] text-white rounded-[2px] font-semibold hover:bg-[#CC0000] transition-colors"
                        data-testid="quick-add-vehicle"
                    >
                        <Plus size={18} />
                        Nova Viatura
                    </Link>
                    <Link
                        to="/admin/campanhas/nova"
                        className="flex items-center justify-center gap-2 p-4 bg-[#1A1A1A] text-white rounded-[2px] font-semibold hover:bg-black transition-colors"
                        data-testid="quick-add-campaign"
                    >
                        <Plus size={18} />
                        Nova Campanha
                    </Link>
                    <Link
                        to="/admin/mensagens"
                        className="flex items-center justify-center gap-2 p-4 bg-white border border-[#E5E5E5] text-[#1A1A1A] rounded-[2px] font-semibold hover:border-[#1A1A1A] transition-colors"
                        data-testid="quick-messages"
                    >
                        <Mail size={18} />
                        Ver Mensagens
                    </Link>
                </div>
            </section>

            {/* Recent Messages */}
            <section aria-label="Mensagens Recentes">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                        Mensagens Recentes
                    </h2>
                    <Link 
                        to="/admin/mensagens"
                        className="text-sm text-[#E60000] hover:underline"
                    >
                        Ver todas →
                    </Link>
                </div>
                
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] divide-y divide-[#E5E5E5]">
                    {recentMessages.length > 0 ? (
                        recentMessages.map((msg) => (
                            <div key={msg.id} className="p-4 hover:bg-[#F9F9F9] transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {!msg.is_read && (
                                                <span className="w-2 h-2 bg-[#E60000] rounded-full flex-shrink-0" />
                                            )}
                                            <span className="font-semibold text-[#1A1A1A] truncate">
                                                {msg.name}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#666666] truncate mt-1">
                                            {msg.message}
                                        </p>
                                    </div>
                                    <span className="text-xs text-[#999999] flex-shrink-0">
                                        {new Date(msg.created_at).toLocaleDateString('pt-PT')}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-[#666666]">
                            <Mail size={32} className="mx-auto mb-2 opacity-30" />
                            <p>Nenhuma mensagem recebida</p>
                        </div>
                    )}
                </div>
            </section>

            {/* TODO Section - For Development Reference */}
            {/* 
            <section className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-[4px]">
                <h3 className="font-bold text-yellow-800 mb-2">Próximos Desenvolvimentos:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Gráfico de vendas por mês</li>
                    <li>• Widget de previsão de stock</li>
                    <li>• Integração com Google Analytics</li>
                    <li>• Notificações push</li>
                </ul>
            </section>
            */}
        </div>
    );
};
