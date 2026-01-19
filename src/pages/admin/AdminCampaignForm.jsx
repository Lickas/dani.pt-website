/**
 * Admin Campaign Form - Create/Edit - Supabase Direct
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { campaignsAPI } from '../../utils/apiService';

export const AdminCampaignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount_percentage: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true,
        vehicle_ids: []
    });

    useEffect(() => {
        if (isEditing) {
            fetchCampaign();
        }
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const campaign = await campaignsAPI.getById(id);
            if (campaign) {
                setFormData({
                    ...campaign,
                    start_date: new Date(campaign.start_date).toISOString().split('T')[0],
                    end_date: new Date(campaign.end_date).toISOString().split('T')[0]
                });
            }
        } catch (error) {
            toast.error('Erro ao carregar campanha');
            navigate('/admin/campanhas');
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString()
            };

            if (isEditing) {
                await campaignsAPI.update(id, payload);
                toast.success('Campanha atualizada');
            } else {
                await campaignsAPI.create(payload);
                toast.success('Campanha criada');
            }
            navigate('/admin/campanhas');
        } catch (error) {
            toast.error('Erro ao guardar campanha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <header className="mb-8">
                <button
                    onClick={() => navigate('/admin/campanhas')}
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar às Campanhas
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white">
                    {isEditing ? 'Editar Campanha' : 'Nova Campanha'}
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Título *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            placeholder="Ex: Promoção de Verão"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Descrição *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555] resize-none"
                            placeholder="Descrição da campanha..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Desconto (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount_percentage}
                            onChange={(e) => handleChange('discount_percentage', e.target.value)}
                            className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            placeholder="Ex: 10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Data de Início</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => handleChange('start_date', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Data de Fim</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => handleChange('end_date', e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                />
                            </div>
                        </div>
                    </div>

                    <label className="flex items-center justify-between cursor-pointer pt-4">
                        <div>
                            <span className="font-medium text-[#1A1A1A] dark:text-white">Campanha Ativa</span>
                            <p className="text-sm text-[#666666] dark:text-gray-400">Mostrar no site</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => handleChange('is_active', e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E5E5] text-[#E60000] focus:ring-[#E60000]"
                        />
                    </label>
                </section>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/campanhas')}
                        className="px-6 py-3 border border-[#E5E5E5] dark:border-[#333] rounded-[2px] text-[#666666] dark:text-gray-400 hover:border-[#1A1A1A] dark:hover:border-[#555] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-[#999999] text-white rounded-[2px] font-semibold transition-colors"
                    >
                        <Save size={18} />
                        {loading ? 'A guardar...' : isEditing ? 'Guardar Alterações' : 'Criar Campanha'}
                    </button>
                </div>
            </form>
        </div>
    );
};
