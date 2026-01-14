import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Search, ChevronRight, Shield, CheckCircle, Star } from 'lucide-react';
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
        <main className="pt-16 md:pt-20">
            {/* ============================================
                HERO SECTION - Clean & Modern
                ============================================ */}
            <section className="min-h-[90vh] flex flex-col justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 relative overflow-hidden">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />

                {/* Background Number - Very subtle */}
                <div className="absolute -right-10 md:-right-20 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block">
                    <span className="font-display text-[28rem] xl:text-[36rem] text-black/[0.02] dark:text-white/[0.02] leading-none">
                        {totalVehicles}
                    </span>
                </div>

                <div className="container-site relative z-10 py-16 md:py-24">
                    <div className="max-w-4xl">
                        {/* Label com linha vermelha */}
                        <div className="flex items-center gap-4 animate-fade-up">
                            <div className="dani-line-short"></div>
                            <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                Stand de Automóveis · Coimbra
                            </span>
                        </div>

                        {/* Headline - Bigger and bolder */}
                        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] text-gray-900 dark:text-white mt-6 animate-fade-up delay-100">
                            Encontre<br/>
                            <span className="text-[#E60000]">o seu.</span>
                        </h1>

                        {/* Frase autoral */}
                        <p className="text-gray-500 dark:text-gray-400 mt-6 md:mt-8 max-w-md text-base md:text-lg leading-relaxed animate-fade-up delay-200">
                            Escolhidos um a um. Sem ruído, sem promessas vazias. Só carros de qualidade comprovada.
                        </p>

                        {/* ================================
                            SEARCH BLOCK - Premium Design
                            ================================ */}
                        <form 
                            onSubmit={handleSearch}
                            className="mt-10 md:mt-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 md:p-6 rounded-sm shadow-xl shadow-gray-900/5 animate-fade-up delay-300"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Brand Select */}
                                <div className="md:col-span-4">
                                    <label className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2">
                                        Marca
                                    </label>
                                    <select
                                        value={searchBrand}
                                        onChange={(e) => setSearchBrand(e.target.value)}
                                        className="input-style"
                                    >
                                        <option value="">Todas as marcas</option>
                                        {brands.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Input */}
                                <div className="md:col-span-4">
                                    <label className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2">
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
                                        <Search size={16} />
                                        Pesquisar
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Quick Stats - More minimal */}
                        <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-6 md:gap-10 animate-fade-up delay-400">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{totalVehicles}</span>
                                </div>
                                <span className="text-sm text-gray-500">Disponíveis</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                    <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-sm text-gray-500">100% Revistos</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Shield size={18} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-sm text-gray-500">Com Garantia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                FEATURED VEHICLES
                ============================================ */}
            <section className="py-20 md:py-28">
                <div className="container-site">
                    {/* Section Header com numeração */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
                        <div className="flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">01</span>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                    Seleção
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                    Em destaque
                                </h2>
                                <p className="text-gray-500 mt-3 text-sm md:text-base">
                                    Revistos. Testados. Prontos para si.
                                </p>
                            </div>
                        </div>
                        <Link 
                            to="/viaturas"
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:text-[#E60000] transition-colors"
                        >
                            Ver todas
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-sm skeleton" />
                                    <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded skeleton" />
                                    <div className="h-5 w-40 bg-gray-100 dark:bg-gray-800 rounded skeleton" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
            <section className="bg-gray-900 dark:bg-black py-20 md:py-28 relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 dark:from-black dark:to-black"></div>
                
                <div className="container-site relative z-10">
                    <div className="flex items-start gap-6 md:gap-8">
                        {/* Linha vermelha vertical */}
                        <div className="hidden md:block w-[2px] h-28 bg-[#E60000] rounded-full"></div>
                        
                        <div className="max-w-3xl">
                            <span className="section-number text-white/20">02</span>
                            <p className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mt-4 leading-tight">
                                Nada escondido.<br/>
                                <span className="text-[#E60000]">Tudo verificado.</span>
                            </p>
                            <p className="text-white/50 mt-6 md:mt-8 text-sm md:text-base max-w-lg leading-relaxed">
                                Cada viatura passa por inspeção rigorosa. Histórico completo, estado real, preço justo. Sem surpresas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                ALL VEHICLES PREVIEW
                ============================================ */}
            <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
                <div className="container-site">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
                        <div className="flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">03</span>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                    Stock Atual
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                    Últimas entradas
                                </h2>
                            </div>
                        </div>
                        <Link 
                            to="/viaturas"
                            className="btn-secondary dani-hover-lift"
                        >
                            Ver catálogo completo
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Grid - 4 columns on desktop */}
                    {!loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
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
            <section className="py-20 md:py-28 bg-white dark:bg-gray-800">
                <div className="container-site">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-16">
                        <div className="lg:max-w-xl flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">04</span>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                    Contacto
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                    Pronto para<br/>conduzir?
                                </h2>
                                <p className="text-gray-500 mt-4 md:mt-6 text-sm md:text-base">
                                    Coimbra. Antanhol. Desde sempre ao seu serviço.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <a href="tel:+351919190993" className="btn-primary dani-hover-lift">
                                Ligar agora
                            </a>
                            <a 
                                href="https://wa.me/351919190993?text=Olá! Gostava de saber mais sobre as viaturas disponíveis."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline dani-hover-lift"
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
