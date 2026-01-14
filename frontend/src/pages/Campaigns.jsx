import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Percent, Tag, ChevronRight } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/campaigns`);
            setCampaigns(response.data);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'long',
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
        <main className="pt-20">
            {/* ============================================
                PAGE HEADER
                ============================================ */}
            <section className="bg-[#FAFAFA] py-16 md:py-24">
                <div className="container-site">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <div className="w-[2px] h-20 bg-[#E60000] hidden md:block"></div>
                            <div>
                                <span className="label-style text-[#999]">Ofertas</span>
                                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-[#1A1A1A] mt-2">
                                    Campanhas
                                </h1>
                                <p className="dani-quote mt-3">
                                    As melhores ofertas. Diretas.
                                </p>
                            </div>
                        </div>
                        <p className="text-[#666] md:text-right">
                            {loading ? '...' : campaigns.length} campanhas ativas
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================================
                CAMPAIGNS GRID
                ============================================ */}
            <section className="py-12 md:py-16">
                <div className="container-site">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-video bg-[#F5F5F5] animate-pulse"></div>
                                    <div className="h-4 w-32 bg-[#F5F5F5] animate-pulse"></div>
                                    <div className="h-6 w-48 bg-[#F5F5F5] animate-pulse"></div>
                                    <div className="h-4 w-40 bg-[#F5F5F5] animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    ) : campaigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map((campaign, index) => (
                                <article
                                    key={campaign.id}
                                    className="group animate-fade-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Image Container */}
                                    {campaign.image_url && (
                                        <div className="aspect-video bg-[#F5F5F5] mb-4 overflow-hidden relative">
                                            {/* Linha vermelha superior - assinatura dANI */}
                                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E60000] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            <img
                                                src={campaign.image_url}
                                                alt={campaign.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {isActive(campaign) && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold uppercase tracking-wide">
                                                        Ativa
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Campaign Info */}
                                    <div className="space-y-3">
                                        {/* Discount Badge */}
                                        {campaign.discount_percentage && (
                                            <div className="flex items-center gap-2">
                                                <Percent size={20} className="text-[#E60000]" />
                                                <span className="text-4xl font-bold text-[#E60000]">
                                                    -{campaign.discount_percentage}%
                                                </span>
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h2 className="text-2xl font-display text-[#1A1A1A] group-hover:text-[#E60000] transition-colors">
                                            {campaign.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-[#666] leading-relaxed">
                                            {campaign.description}
                                        </p>

                                        {/* Dates */}
                                        <div className="flex items-center gap-2 text-sm text-[#999]">
                                            <Calendar size={16} />
                                            <span>
                                                {formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}
                                            </span>
                                        </div>

                                        {/* Applicable Vehicles */}
                                        {campaign.applicable_vehicle_ids && campaign.applicable_vehicle_ids.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-[#666]">
                                                <Tag size={16} />
                                                <span>
                                                    Aplicável a {campaign.applicable_vehicle_ids.length} {campaign.applicable_vehicle_ids.length === 1 ? 'viatura' : 'viaturas'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="divider mt-6"></div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <Percent size={64} className="mx-auto text-[#E8E8E8] mb-6" />
                            <h3 className="text-2xl font-display text-[#1A1A1A] mb-2">
                                Nenhuma campanha disponível
                            </h3>
                            <p className="text-[#666]">
                                Volte mais tarde para ver as nossas ofertas especiais
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================
                CTA SECTION
                ============================================ */}
            <section className="py-16 md:py-24 bg-[#1A1A1A]">
                <div className="container-site text-center">
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                        Interessado numa oferta?
                    </h2>
                    <p className="text-[#999] mb-8 max-w-2xl mx-auto">
                        Entre em contacto connosco para saber mais sobre as nossas campanhas e encontrar a viatura perfeita para si.
                    </p>
                    <a
                        href="/contactos"
                        className="inline-block px-8 py-4 bg-[#E60000] text-white font-semibold hover:bg-[#CC0000] transition-colors"
                    >
                        Falar Connosco
                    </a>
                </div>
            </section>
        </main>
    );
};
