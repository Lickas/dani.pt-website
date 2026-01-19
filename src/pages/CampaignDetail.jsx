/**
 * Campaign Detail Page - dANI.PT
 * Shows full details of a specific campaign
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Clock, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { campaignsAPI } from '../utils/apiService';

export const CampaignDetail = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await campaignsAPI.getById(id);
                setCampaign(data);
            } catch (err) {
                console.error('Error fetching campaign:', err);
                setError('Campanha não encontrada');
                setCampaign(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <main className="pt-16 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container-site py-12">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        <div className="aspect-[21/9] bg-gray-200 dark:bg-gray-800 rounded-sm"></div>
                        <div className="space-y-4">
                            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
                            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !campaign) {
        return (
            <main className="pt-16 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container-site py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {error || 'Campanha não encontrada'}
                    </h1>
                    <Link 
                        to="/campanhas"
                        className="inline-flex items-center gap-2 text-[#E60000] font-semibold hover:underline"
                    >
                        <ArrowLeft size={18} />
                        Ver todas as campanhas
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-16 md:pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Back Link */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="container-site py-4">
                    <Link 
                        to="/campanhas"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E60000] transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        Voltar às campanhas
                    </Link>
                </div>
            </div>

            {/* Hero Image */}
            {campaign.image_url && (
                <div className="relative aspect-[21/9] md:aspect-[3/1] bg-gray-900 overflow-hidden">
                    <img 
                        src={campaign.image_url} 
                        alt={campaign.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Discount Badge */}
                    {campaign.discount_percentage && (
                        <div className="absolute top-6 right-6 md:top-10 md:right-10">
                            <div className="bg-[#E60000] text-white px-6 py-3 rounded-sm shadow-lg">
                                <span className="text-3xl md:text-5xl font-bold">-{campaign.discount_percentage}%</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <div className="container-site">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase rounded-full mb-4">
                                <Tag size={12} />
                                Campanha Especial
                            </span>
                            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white">
                                {campaign.title}
                            </h1>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="container-site py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Title (if no image) */}
                        {!campaign.image_url && (
                            <div className="mb-8">
                                {campaign.discount_percentage && (
                                    <span className="inline-block px-4 py-2 bg-[#E60000] text-white text-lg font-bold rounded-sm mb-4">
                                        -{campaign.discount_percentage}%
                                    </span>
                                )}
                                <h1 className="font-display text-4xl md:text-5xl text-gray-900 dark:text-white">
                                    {campaign.title}
                                </h1>
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-[2px] bg-[#E60000]"></div>
                                Sobre esta campanha
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                {campaign.description}
                            </p>
                        </div>

                        {/* Terms & Conditions */}
                        {campaign.terms_conditions && (
                            <div className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-[#E60000]" />
                                    Termos e Condições
                                </h3>
                                <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {campaign.terms_conditions}
                                </div>
                            </div>
                        )}

                        {/* Campaign Benefits */}
                        <div className="mt-10">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="w-8 h-[2px] bg-[#E60000]"></div>
                                O que está incluído
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-sm border border-gray-100 dark:border-gray-700">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Desconto Direto</h4>
                                        <p className="text-sm text-gray-500">Aplicado no preço final da viatura</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-sm border border-gray-100 dark:border-gray-700">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Financiamento Facilitado</h4>
                                        <p className="text-sm text-gray-500">Condições especiais de crédito</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-sm border border-gray-100 dark:border-gray-700">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Garantia Incluída</h4>
                                        <p className="text-sm text-gray-500">Mínimo 12 meses de garantia</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-sm border border-gray-100 dark:border-gray-700">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Revisão Completa</h4>
                                        <p className="text-sm text-gray-500">Viatura 100% verificada</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Campaign Info Card */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                                    Detalhes da Campanha
                                </h3>
                                
                                <div className="space-y-4">
                                    {campaign.discount_percentage && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#E60000]/10 rounded-full flex items-center justify-center">
                                                <Tag size={18} className="text-[#E60000]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Desconto</p>
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">
                                                    {campaign.discount_percentage}%
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {campaign.start_date && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                                <Calendar size={18} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Início</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {formatDate(campaign.start_date)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {campaign.end_date && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                                                <Clock size={18} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Termina</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {formatDate(campaign.end_date)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    {campaign.is_active ? (
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Campanha Ativa
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-semibold rounded-full">
                                            Campanha Terminada
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-[#E60000] p-6 rounded-sm text-white">
                                <h3 className="font-bold text-xl mb-2">
                                    Interessado?
                                </h3>
                                <p className="text-white/80 text-sm mb-6">
                                    Contacte-nos para saber mais sobre esta campanha e as viaturas disponíveis.
                                </p>
                                <div className="space-y-3">
                                    <a 
                                        href="tel:+351919190993"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[#E60000] font-semibold rounded-sm hover:bg-gray-100 transition-colors"
                                    >
                                        <Phone size={18} />
                                        Ligar Agora
                                    </a>
                                    <a 
                                        href={`https://wa.me/351919190993?text=Olá! Estou interessado na campanha "${campaign.title}". Pode dar-me mais informações?`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white font-semibold rounded-sm hover:bg-white/20 transition-colors"
                                    >
                                        <MessageCircle size={18} />
                                        WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* View Vehicles Link */}
                            <Link 
                                to="/viaturas"
                                className="block text-center py-4 bg-gray-900 dark:bg-gray-700 text-white font-semibold rounded-sm hover:bg-black dark:hover:bg-gray-600 transition-colors"
                            >
                                Ver Viaturas Disponíveis
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
