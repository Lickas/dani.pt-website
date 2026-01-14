import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Search } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Search state
    const [searchBrand, setSearchBrand] = useState('');
    const [searchMaxPrice, setSearchMaxPrice] = useState('');

    const brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Peugeot', 'Toyota', 'Renault', 'Tesla', 'Ford', 'Volvo'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/vehicles`);
                setVehicles(response.data);
                setFeaturedVehicles(response.data.filter(v => v.is_featured).slice(0, 3));
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchBrand) params.append('brand', searchBrand);
        if (searchMaxPrice) params.append('max_price', searchMaxPrice);
        navigate(`/viaturas?${params.toString()}`);
    };

    const totalVehicles = vehicles.length;

    return (
        <main className="pt-20">
            {/* ============================================
                HERO SECTION - Search Dominant
                ============================================ */}
            <section className="min-h-[90vh] flex flex-col justify-center bg-[#FAFAFA] relative overflow-hidden">
                {/* Background Number */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block">
                    <span className="font-display text-[40rem] text-black/[0.02] leading-none">
                        {totalVehicles}
                    </span>
                </div>

                <div className="container-site relative z-10 py-20">
                    <div className="max-w-4xl">
                        {/* Label com linha vermelha */}
                        <div className="flex items-center gap-4 animate-fade-up">
                            <div className="dani-line-short"></div>
                            <span className="label-style text-[#999]">
                                Stand de Automóveis · Coimbra
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#1A1A1A] mt-4 animate-fade-up delay-100">
                            Encontre<br/>
                            o seu.
                        </h1>

                        {/* Frase autoral */}
                        <p className="dani-quote mt-6 max-w-md animate-fade-up delay-200">
                            Escolhidos um a um. Sem ruído. Só carros.
                        </p>

                        {/* ================================
                            SEARCH BLOCK - Premium Design
                            ================================ */}
                        <form 
                            onSubmit={handleSearch}
                            className="mt-12 bg-white border border-[#E8E8E8] p-6 md:p-8 animate-fade-up delay-300"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                                {/* Brand Select */}
                                <div className="md:col-span-4">
                                    <label className="label-style text-[#999] mb-2 block">
                                        Marca
                                    </label>
                                    <select
                                        value={searchBrand}
                                        onChange={(e) => setSearchBrand(e.target.value)}
                                        className="input-style"
                                    >
                                        <option value="">Todas</option>
                                        {brands.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Input */}
                                <div className="md:col-span-4">
                                    <label className="label-style text-[#999] mb-2 block">
                                        Preço Máximo
                                    </label>
                                    <input
                                        type="number"
                                        value={searchMaxPrice}
                                        onChange={(e) => setSearchMaxPrice(e.target.value)}
                                        placeholder="Ex: 30000"
                                        className="input-style"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="md:col-span-4 flex items-end">
                                    <button
                                        type="submit"
                                        className="btn-primary w-full"
                                    >
                                        <Search size={18} />
                                        Pesquisar
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Quick Stats */}
                        <div className="mt-8 flex items-center gap-8 animate-fade-up delay-400">
                            <div>
                                <span className="text-3xl font-bold text-[#1A1A1A]">{totalVehicles}</span>
                                <span className="block text-xs text-[#999] mt-1">Disponíveis</span>
                            </div>
                            <div className="w-px h-10 bg-[#E8E8E8]"></div>
                            <div>
                                <span className="text-3xl font-bold text-[#1A1A1A]">100%</span>
                                <span className="block text-xs text-[#999] mt-1">Revistos</span>
                            </div>
                            <div className="w-px h-10 bg-[#E8E8E8]"></div>
                            <div>
                                <span className="text-3xl font-bold text-[#1A1A1A]">Garantia</span>
                                <span className="block text-xs text-[#999] mt-1">Incluída</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                FEATURED VEHICLES
                ============================================ */}
            <section className="py-24 md:py-32">
                <div className="container-site">
                    {/* Section Header com numeração */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="flex items-start gap-6">
                            <span className="section-number pt-1">01</span>
                            <div>
                                <span className="label-style text-[#999]">Seleção</span>
                                <h2 className="font-display text-5xl md:text-6xl text-[#1A1A1A] mt-2">
                                    Em destaque
                                </h2>
                                <p className="dani-quote mt-3">
                                    Revistos. Testados. Prontos.
                                </p>
                            </div>
                        </div>
                        <Link 
                            to="/viaturas"
                            className="group flex items-center gap-2 text-sm font-semibold text-[#1A1A1A] hover:text-[#E60000] transition-colors dani-hover-underline"
                        >
                            Ver todas
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[4/3] bg-[#F5F5F5] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredVehicles.map((vehicle, index) => (
                                <div 
                                    key={vehicle.id}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================
                DIVIDER - Brand Statement
                ============================================ */}
            <section className="bg-[#1A1A1A] py-24 md:py-32">
                <div className="container-site">
                    <div className="flex items-start gap-8">
                        {/* Linha vermelha vertical */}
                        <div className="hidden md:block w-[2px] h-24 bg-[#E60000]"></div>
                        
                        <div className="max-w-3xl">
                            <span className="section-number text-white/20">02</span>
                            <p className="font-display text-4xl md:text-5xl lg:text-6xl text-white mt-4 leading-tight">
                                Nada escondido.<br/>
                                <span className="text-[#E60000]">Tudo verificado.</span>
                            </p>
                            <p className="text-white/50 mt-8 text-base max-w-lg leading-relaxed">
                                Cada viatura passa por inspeção rigorosa. Sem surpresas. Sem promessas vazias. Só qualidade comprovada.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                ALL VEHICLES PREVIEW
                ============================================ */}
            <section className="py-24 md:py-32 bg-[#FAFAFA]">
                <div className="container-site">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <span className="label-style text-[#999]">Stock</span>
                            <h2 className="font-display text-5xl md:text-6xl text-[#1A1A1A] mt-2">
                                Últimas entradas
                            </h2>
                        </div>
                        <Link 
                            to="/viaturas"
                            className="btn-secondary"
                        >
                            Ver catálogo completo
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Grid - 4 columns on desktop */}
                    {!loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {vehicles.slice(0, 8).map((vehicle, index) => (
                                <div 
                                    key={vehicle.id}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================
                CTA SECTION
                ============================================ */}
            <section className="py-24 md:py-32">
                <div className="container-site">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-24">
                        <div className="lg:max-w-xl">
                            <span className="label-style text-[#999]">Visite-nos</span>
                            <h2 className="font-display text-5xl md:text-6xl text-[#1A1A1A] mt-2">
                                Pronto para<br/>conduzir?
                            </h2>
                            <p className="text-[#666] mt-6 text-lg">
                                Marque uma visita ao nosso stand ou ligue-nos diretamente. 
                                Estamos em Coimbra, prontos para o receber.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="tel:+351919190993" className="btn-primary">
                                Ligar agora
                            </a>
                            <a 
                                href="https://wa.me/351919190993?text=Olá! Gostava de saber mais sobre as viaturas disponíveis."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
