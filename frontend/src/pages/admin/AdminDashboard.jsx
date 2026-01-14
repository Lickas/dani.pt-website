import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Car, Megaphone, Mail, MailOpen, TrendingUp } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getAuthHeaders } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_URL}/stats`, {
                    headers: getAuthHeaders()
                });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [getAuthHeaders]);

    const statCards = stats ? [
        {
            label: 'Total Viaturas',
            value: stats.total_vehicles,
            icon: Car,
            color: 'bg-blue-50 text-blue-600',
            link: '/admin/viaturas'
        },
        {
            label: 'Disponíveis',
            value: stats.available_vehicles,
            icon: TrendingUp,
            color: 'bg-green-50 text-green-600',
            link: '/admin/viaturas'
        },
        {
            label: 'Vendidas',
            value: stats.sold_vehicles,
            icon: Car,
            color: 'bg-gray-50 text-gray-600',
            link: '/admin/viaturas'
        },
        {
            label: 'Campanhas Ativas',
            value: stats.active_campaigns,
            icon: Megaphone,
            color: 'bg-purple-50 text-purple-600',
            link: '/admin/campanhas'
        },
        {
            label: 'Mensagens Não Lidas',
            value: stats.unread_messages,
            icon: MailOpen,
            color: 'bg-red-50 text-red-600',
            link: '/admin/mensagens'
        },
        {
            label: 'Total Mensagens',
            value: stats.total_messages,
            icon: Mail,
            color: 'bg-gray-50 text-gray-600',
            link: '/admin/mensagens'
        }
    ] : [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-archivo font-black text-2xl md:text-3xl text-[#1A1A1A]">
                    Dashboard
                </h1>
                <p className="text-[#666666] mt-1">
                    Visão geral do stand dANI.PT
                </p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-32 bg-[#F4F4F4] rounded-[4px] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((card) => (
                        <Link
                            key={card.label}
                            to={card.link}
                            className="bg-white border border-[#E5E5E5] rounded-[4px] p-6 hover:border-[#1A1A1A] transition-colors"
                            data-testid={`stat-card-${card.label.toLowerCase().replace(/ /g, '-')}`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-widest text-[#999999]">
                                        {card.label}
                                    </span>
                                    <p className="font-archivo font-black text-4xl text-[#1A1A1A] mt-2">
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
            )}

            {/* Quick Actions */}
            <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                    Ações Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/viaturas/nova"
                        className="p-4 bg-[#E60000] text-white rounded-[2px] text-center font-semibold hover:bg-[#CC0000] transition-colors"
                        data-testid="quick-action-new-vehicle"
                    >
                        + Nova Viatura
                    </Link>
                    <Link
                        to="/admin/campanhas/nova"
                        className="p-4 bg-[#1A1A1A] text-white rounded-[2px] text-center font-semibold hover:bg-black transition-colors"
                        data-testid="quick-action-new-campaign"
                    >
                        + Nova Campanha
                    </Link>
                    <Link
                        to="/admin/mensagens"
                        className="p-4 bg-[#F4F4F4] text-[#1A1A1A] rounded-[2px] text-center font-semibold hover:bg-[#E5E5E5] transition-colors"
                        data-testid="quick-action-messages"
                    >
                        Ver Mensagens
                    </Link>
                </div>
            </div>
        </div>
    );
};
