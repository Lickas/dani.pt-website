/**
 * Admin Campaigns - Supabase Direct
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Calendar, Percent, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { campaignsAPI } from '../../utils/apiService';

export const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const data = await campaignsAPI.getAllAdmin();
            setCampaigns(data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setCampaigns([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Eliminar esta campanha?')) return;

        try {
            await campaignsAPI.delete(id);
            toast.success('Campanha eliminada');
            setCampaigns(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            toast.error('Erro ao eliminar');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const isActive = (campaign) => {
        const now = new Date();
        const start = new Date(campaign.start_date);
        const end = new Date(campaign.end_date);
        return campaign.is_active && now >= start && now <= end;
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white">Campanhas</h1>
                    <p className="text-[#666666] dark:text-gray-400 mt-1">Gerir promoções e ofertas especiais</p>
                </div>
                <Link 
                    to="/admin/campanhas/nova"
                    className="flex items-center gap-2 px-4 py-2 bg-[#E60000] text-white rounded-[2px] font-semibold hover:bg-[#CC0000] transition-colors"
                >
                    <Plus size={18} />
                    Nova Campanha
                </Link>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-[4px] animate-pulse" />
                    ))}
                </div>
            ) : campaigns.length === 0 ? (
                <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-8 text-center">
                    <Percent size={48} className="mx-auto mb-4 text-[#999999] opacity-30" />
                    <p className="text-[#666666] dark:text-gray-400">Nenhuma campanha registada</p>
                    <Link to="/admin/campanhas/nova" className="inline-block mt-4 text-[#E60000] hover:underline">
                        Criar primeira campanha →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <article
                            key={campaign.id}
                            className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6 hover:border-[#1A1A1A] dark:hover:border-[#555] transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-2 py-1 rounded-[2px] text-xs font-mono uppercase ${
                                    isActive(campaign)
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                    {isActive(campaign) ? 'Ativa' : 'Inativa'}
                                </span>
                                <div className="flex gap-1">
                                    <Link 
                                        to={`/admin/campanhas/ver/${campaign.id}`}
                                        className="p-2 text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F4F4F4] dark:hover:bg-[#333] rounded-[2px] transition-colors"
                                        title="Ver detalhes"
                                    >
                                        <Eye size={16} />
                                    </Link>
                                    <Link 
                                        to={`/admin/campanhas/editar/${campaign.id}`}
                                        className="p-2 text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F4F4F4] dark:hover:bg-[#333] rounded-[2px] transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(campaign.id)}
                                        className="p-2 text-[#666666] hover:text-[#E60000] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[2px] transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <Link to={`/admin/campanhas/ver/${campaign.id}`}>
                                <h3 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-2 hover:text-[#E60000] transition-colors">
                                    {campaign.title}
                                </h3>
                            </Link>
                            <p className="text-sm text-[#666666] dark:text-gray-400 mb-4 line-clamp-2">
                                {campaign.description}
                            </p>

                            {campaign.discount_percentage && (
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-[#E60000]">-{campaign.discount_percentage}%</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-[#999999] dark:text-gray-500">
                                <Calendar size={14} />
                                <span>{formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};
