import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAuthHeaders } = useAuth();

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get(`${API_URL}/campaigns/all`, {
                headers: getAuthHeaders()
            });
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem a certeza que deseja eliminar esta campanha?')) return;

        try {
            await axios.delete(`${API_URL}/campaigns/${id}`, {
                headers: getAuthHeaders()
            });
            toast.success('Campanha eliminada com sucesso');
            setCampaigns(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            toast.error('Erro ao eliminar campanha');
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "d 'de' MMMM yyyy", { locale: pt });
        } catch {
            return dateString;
        }
    };

    const isActive = (campaign) => {
        const now = new Date();
        const start = new Date(campaign.start_date);
        const end = new Date(campaign.end_date);
        return campaign.is_active && now >= start && now <= end;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-archivo font-black text-2xl md:text-3xl text-[#1A1A1A]">
                        Campanhas
                    </h1>
                    <p className="text-[#666666] mt-1">
                        Gerir campanhas e promoções
                    </p>
                </div>
                <Link to="/admin/campanhas/nova">
                    <Button 
                        className="bg-[#E60000] hover:bg-[#CC0000] rounded-[2px]"
                        data-testid="add-campaign-btn"
                    >
                        <Plus size={18} className="mr-2" />
                        Nova Campanha
                    </Button>
                </Link>
            </div>

            {/* Campaigns Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-[#F4F4F4] rounded-[4px] animate-pulse" />
                    ))}
                </div>
            ) : campaigns.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-8 text-center">
                    <p className="text-[#666666]">Nenhuma campanha registada</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="campaigns-grid">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white border border-[#E5E5E5] rounded-[4px] p-6 hover:border-[#1A1A1A] transition-colors"
                            data-testid={`campaign-card-${campaign.id}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className={`px-2 py-1 rounded-[2px] text-xs font-mono uppercase ${
                                    isActive(campaign)
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {isActive(campaign) ? 'Ativa' : 'Inativa'}
                                </span>
                                <div className="flex gap-2">
                                    <Link to={`/admin/campanhas/${campaign.id}`}>
                                        <Button variant="ghost" size="sm">
                                            <Pencil size={16} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(campaign.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>

                            <h3 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-2">
                                {campaign.title}
                            </h3>
                            <p className="text-sm text-[#666666] mb-4 line-clamp-2">
                                {campaign.description}
                            </p>

                            {campaign.discount_percentage && (
                                <div className="mb-4">
                                    <span className="text-2xl font-archivo font-black text-[#E60000]">
                                        -{campaign.discount_percentage}%
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-[#999999]">
                                <Calendar size={14} />
                                <span>
                                    {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
