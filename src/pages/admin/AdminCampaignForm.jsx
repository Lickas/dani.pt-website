/**
 * Admin Campaign Form - Create/Edit - Supabase Direct
 * Com múltiplos tipos de promoção
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Percent, Euro, Car, CreditCard, Wrench, Shield, Gift, Package, Star } from 'lucide-react';
import { toast } from 'sonner';
import { campaignsAPI } from '../../utils/apiService';
import { CAMPAIGN_TYPES } from '../../utils/constants';

const CAMPAIGN_ICONS = {
    'percentage': Percent,
    'fixed_value': Euro,
    'trade_in': Car,
    'financing': CreditCard,
    'free_service': Wrench,
    'extended_warranty': Shield,
    'gift': Gift,
    'bundle': Package,
    'other': Star
};

export const AdminCampaignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        campaign_type: 'percentage',
        discount_percentage: '',
        discount_value: '',
        benefit_description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_active: true,
        terms_conditions: '',
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
                    campaign_type: campaign.campaign_type || 'percentage',
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
            // 1. Prepara os dados
            const payload = {
                ...formData,
                discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
                discount_value: formData.discount_value ? parseFloat(formData.discount_value) : null,
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString()
            };

            // 2. CORREÇÃO CRÍTICA AQUI:
            // Se estamos a CRIAR (não editar), removemos o ID para o Supabase gerar um novo.
            if (!isEditing) {
                delete payload.id;
                delete payload.created_at; // Remove também a data de criação para ser automática
            }

            if (isEditing) {
                await campaignsAPI.update(id, payload);
                toast.success('Campanha atualizada');
            } else {
                await campaignsAPI.create(payload);
                toast.success('Campanha criada');
            }
            navigate('/admin/campanhas');
        } catch (error) {
            console.error(error); // Bom para veres o erro na consola
            toast.error('Erro ao guardar campanha');
        } finally {
            setLoading(false);
        }
    };

    const selectedType = CAMPAIGN_TYPES.find(t => t.value === formData.campaign_type);
    const IconComponent = CAMPAIGN_ICONS[formData.campaign_type] || Star;

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
                {/* Informações Básicas */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6 space-y-4">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Informações Básicas</h2>
                    
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
                </section>

                {/* Tipo de Promoção */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6 space-y-4">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Tipo de Promoção</h2>
                    
                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-3">Selecione o tipo *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {CAMPAIGN_TYPES.map((type) => {
                                const TypeIcon = CAMPAIGN_ICONS[type.value] || Star;
                                const isSelected = formData.campaign_type === type.value;
                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleChange('campaign_type', type.value)}
                                        className={`flex items-center gap-3 p-4 border-2 rounded-[4px] text-left transition-all ${
                                            isSelected
                                                ? 'border-[#E60000] bg-red-50 dark:bg-red-900/20'
                                                : 'border-[#E5E5E5] dark:border-[#333] hover:border-[#999] dark:hover:border-[#555]'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            isSelected ? 'bg-[#E60000] text-white' : 'bg-[#F4F4F4] dark:bg-[#333] text-[#666]'
                                        }`}>
                                            <TypeIcon size={20} />
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            isSelected ? 'text-[#E60000]' : 'text-[#1A1A1A] dark:text-white'
                                        }`}>
                                            {type.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Campos dinâmicos baseados no tipo */}
                    <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#333]">
                        {formData.campaign_type === 'percentage' && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Desconto em Percentagem (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discount_percentage}
                                        onChange={(e) => handleChange('discount_percentage', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                        placeholder="Ex: 15"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999]">%</span>
                                </div>
                            </div>
                        )}

                        {formData.campaign_type === 'fixed_value' && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Desconto em Valor (€)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.discount_value}
                                        onChange={(e) => handleChange('discount_value', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                        placeholder="Ex: 1500"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999]">€</span>
                                </div>
                            </div>
                        )}

                        {formData.campaign_type === 'trade_in' && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Bónus de Retoma (€)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.discount_value}
                                        onChange={(e) => handleChange('discount_value', e.target.value)}
                                        className="w-full px-4 py-3 pr-12 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                        placeholder="Ex: 2000"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999]">€</span>
                                </div>
                                <p className="text-xs text-[#999] mt-2">Valor de bónus adicional na retoma do veículo usado</p>
                            </div>
                        )}

                        {['financing', 'free_service', 'extended_warranty', 'gift', 'bundle', 'other'].includes(formData.campaign_type) && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Descrição do Benefício *</label>
                                <textarea
                                    value={formData.benefit_description}
                                    onChange={(e) => handleChange('benefit_description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555] resize-none"
                                    placeholder={{
                                        'financing': 'Ex: Taxa 0% nos primeiros 12 meses',
                                        'free_service': 'Ex: Revisão completa incluída',
                                        'extended_warranty': 'Ex: +2 anos de garantia',
                                        'gift': 'Ex: GPS + Tapetes + Película',
                                        'bundle': 'Ex: Pack Inverno com pneus de neve',
                                        'other': 'Descreva o benefício...'
                                    }[formData.campaign_type]}
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* Datas */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6 space-y-4">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Período da Campanha</h2>
                    
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
                </section>

                {/* Termos e Condições */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6 space-y-4">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Termos e Condições</h2>
                    <textarea
                        value={formData.terms_conditions}
                        onChange={(e) => handleChange('terms_conditions', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555] resize-none"
                        placeholder="Termos e condições da promoção (opcional)..."
                    />
                </section>

                {/* Estado */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <label className="flex items-center justify-between cursor-pointer">
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

                {/* Botões */}
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
