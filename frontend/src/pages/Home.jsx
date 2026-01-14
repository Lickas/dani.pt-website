import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { VehicleCard } from '../components/VehicleCard';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Home = () => {
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, campaignsRes] = await Promise.all([
                    axios.get(`${API_URL}/vehicles?is_featured=true`),
                    axios.get(`${API_URL}/campaigns?active_only=true`)
                ]);
                setFeaturedVehicles(vehiclesRes.data.slice(0, 6));
                setCampaigns(campaignsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const features = [
        {
            icon: Shield,
            title: 'Garantia Incluída',
            description: 'Todas as nossas viaturas incluem garantia de qualidade.'
        },
        {
            icon: Clock,
            title: 'Financiamento Rápido',
            description: 'Soluções de financiamento flexíveis e aprovação rápida.'
        },
        {
            icon: Award,
            title: 'Qualidade Certificada',
            description: 'Viaturas inspecionadas e certificadas antes da venda.'
        }
    ];

    return (
        <main className="pt-16 md:pt-20 pb-20 md:pb-0">
            {/* Hero Section */}
            <section className="relative bg-[#1A1A1A] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 min-h-[70vh] items-center py-16 lg:py-0">
                        {/* Content */}
                        <div className="relative z-10 text-white animate-fade-in-up">
                            <span className="inline-block font-mono text-xs uppercase tracking-widest text-[#E60000] mb-4">
                                Stand de Automóveis em Coimbra
                            </span>
                            <h1 className="font-archivo font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-none mb-6">
                                O seu próximo<br />
                                carro está<br />
                                <span className="text-[#E60000]">aqui.</span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-md mb-8">
                                Viaturas usadas de qualidade com total transparência. 
                                Encontre o carro perfeito para si.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/viaturas">
                                    <Button 
                                        size="lg"
                                        className="w-full sm:w-auto bg-[#E60000] hover:bg-[#CC0000] text-white rounded-[2px] font-semibold tracking-wide btn-lift"
                                        data-testid="hero-cta-viaturas"
                                    >
                                        Ver Viaturas
                                        <ArrowRight className="ml-2" size={18} />
                                    </Button>
                                </Link>
                                <Link to="/contactos">
                                    <Button 
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 rounded-[2px] font-semibold tracking-wide"
                                        data-testid="hero-cta-contactos"
                                    >
                                        Contacte-nos
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1638850846828-fcb8f537180a?w=1200&q=80"
                                alt="Viatura em destaque"
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-transparent to-transparent lg:block hidden" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaign Banner */}
            {campaigns.length > 0 && (
                <section className="bg-[#E60000] py-4">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                        <div className="flex items-center justify-center gap-4 text-white text-center">
                            <span className="font-mono text-xs uppercase tracking-widest">
                                {campaigns[0].title}
                            </span>
                            <span className="hidden sm:block">—</span>
                            <span className="text-sm">
                                {campaigns[0].description}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-16 md:py-24 bg-[#F4F4F4]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={feature.title}
                                className="bg-white border border-[#E5E5E5] rounded-[4px] p-8 animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <feature.icon 
                                    size={32} 
                                    className="text-[#E60000] mb-4" 
                                    strokeWidth={1.5}
                                />
                                <h3 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[#666666] text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vehicles */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                                Viaturas em Destaque
                            </span>
                            <h2 className="font-archivo font-black text-3xl md:text-4xl text-[#1A1A1A] mt-2">
                                As nossas melhores<br />ofertas
                            </h2>
                        </div>
                        <Link to="/viaturas">
                            <Button 
                                variant="outline"
                                className="rounded-[2px] border-[#E5E5E5] hover:border-[#1A1A1A] font-semibold"
                                data-testid="view-all-vehicles"
                            >
                                Ver Todas
                                <ArrowRight className="ml-2" size={16} />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div 
                                    key={i}
                                    className="bg-[#F4F4F4] rounded-[4px] h-96 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredVehicles.map((vehicle, index) => (
                                <div 
                                    key={vehicle.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-[#1A1A1A]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center">
                    <h2 className="font-archivo font-black text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                        Pronto para encontrar<br />
                        o seu carro ideal?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Entre em contacto connosco ou visite o nosso stand em Coimbra. 
                        Estamos aqui para ajudar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+351919190993">
                            <Button 
                                size="lg"
                                className="w-full sm:w-auto bg-[#E60000] hover:bg-[#CC0000] text-white rounded-[2px] font-semibold tracking-wide btn-lift"
                                data-testid="cta-phone"
                            >
                                Ligar Agora
                            </Button>
                        </a>
                        <a 
                            href="https://wa.me/351919190993?text=Olá! Estou interessado em saber mais sobre as viaturas disponíveis."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button 
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 rounded-[2px] font-semibold tracking-wide"
                                data-testid="cta-whatsapp"
                            >
                                WhatsApp
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};
