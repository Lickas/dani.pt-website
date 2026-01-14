/**
 * Admin Campaign Detail Page
 * Shows full details of a campaign for admin review/edit
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Tag, Clock, Pencil, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminCampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('dani_admin_token');
        if (!token) {
            navigate('/admin');
            return {};
        }
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axios.get(`${API_URL}/campaigns/${id}`, {
                    headers: getAuthHeaders()
                });
                setCampaign(response.data);
            } catch (err) {
                console.error('Error fetching campaign:', err);
                toast.error('Campanha não encontrada');
                navigate('/admin/campanhas');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm('Tem a certeza que deseja eliminar esta campanha?')) return;

        try {
            await axios.delete(`${API_URL}/campaigns/${id}`, {
                headers: getAuthHeaders()
            });
            toast.success('Campanha eliminada com sucesso');
            navigate('/admin/campanhas');
        } catch (error) {
            toast.error('Erro ao eliminar campanha');
        }
    };

    const toggleActive = async () => {
        try {
            await axios.put(`${API_URL}/campaigns/${id}`, {
                is_active: !campaign.is_active
            }, {
                headers: getAuthHeaders()
            });
            setCampaign(prev => ({ ...prev, is_active: !prev.is_active }));
            toast.success(campaign.is_active ? 'Campanha desativada' : 'Campanha ativada');
        } catch (error) {
            toast.error('Erro ao atualizar campanha');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Não definida';
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="p-6 md:p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Campanha não encontrada
                </h2>
                <Link to="/admin/campanhas" className="text-[#E60000] hover:underline">
                    Voltar às campanhas
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/admin/campanhas"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Detalhes da Campanha
                        </h1>
                        <p className="text-gray-500 text-sm">ID: {campaign.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to={`/campanhas/${campaign.id}`}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
                    >
                        <Eye size={18} />
                        Ver no site
                    </Link>
                    <Link
                        to={`/admin/campanhas/editar/${campaign.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-black transition-colors"
                    >
                        <Pencil size={18} />
                        Editar
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-sm hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={18} />
                        Eliminar
                    </button>
                </div>
            </div>

            {/* Campaign Image */}
            {campaign.image_url && (
                <div className="aspect-[21/9] bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden mb-8">
                    <img 
                        src={campaign.image_url} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Campaign Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Status */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {campaign.title}
                            </h2>
                            <button
                                onClick={toggleActive}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                                    campaign.is_active 
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {campaign.is_active ? (
                                    <>
                                        <CheckCircle size={16} />
                                        Ativa
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={16} />
                                        Inativa
                                    </>
                                )}
                            </button>
                        </div>

                        {campaign.discount_percentage && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E60000] text-white rounded-sm mb-4">
                                <Tag size={18} />
                                <span className="text-2xl font-bold">-{campaign.discount_percentage}%</span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <div className="w-6 h-[2px] bg-[#E60000]"></div>
                            Descrição
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {campaign.description || 'Sem descrição'}
                        </p>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <div className="w-6 h-[2px] bg-[#E60000]"></div>
                            Termos e Condições
                        </h3>
                        <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {campaign.terms_conditions || 'Nenhuns termos definidos'}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Dates Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Período da Campanha
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                    <Calendar size={18} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Data Início</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatDate(campaign.start_date)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                                    <Clock size={18} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Data Fim</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatDate(campaign.end_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Informações
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Criada em</span>
                                <span className="text-gray-900 dark:text-white">
                                    {formatDate(campaign.created_at)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Atualizada em</span>
                                <span className="text-gray-900 dark:text-white">
                                    {formatDate(campaign.updated_at)}
                                </span>
                            </div>
                            {campaign.applicable_vehicle_ids && campaign.applicable_vehicle_ids.length > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Viaturas aplicáveis</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {campaign.applicable_vehicle_ids.length}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Ações Rápidas
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={toggleActive}
                                className={`w-full py-2 px-4 rounded-sm font-medium transition-colors ${
                                    campaign.is_active
                                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                            >
                                {campaign.is_active ? 'Desativar Campanha' : 'Ativar Campanha'}
                            </button>
                            <Link
                                to={`/admin/campanhas/editar/${campaign.id}`}
                                className="block w-full py-2 px-4 bg-gray-900 text-white text-center rounded-sm font-medium hover:bg-black transition-colors"
                            >
                                Editar Campanha
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
