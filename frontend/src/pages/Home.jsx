import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Search, ChevronRight, Shield, CheckCircle, Star, Phone, MessageCircle, MapPin, Clock, Fuel, Calendar, Settings, Car } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Hero background image
const HERO_BG = "https://images.unsplash.com/photo-1701241966709-5371c9bf0f1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwwfHx8YmxhY2t8MTc2ODQyODQ3M3ww&ixlib=rb-4.1.0&q=85&w=1920";

export const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Search state
    const [searchBrand, setSearchBrand] = useState('');
    const [searchFuel, setSearchFuel] = useState('');
    const [searchMaxPrice, setSearchMaxPrice] = useState(100000);
    const [searchMinYear, setSearchMinYear] = useState('');

    const brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Peugeot', 'Toyota', 'Renault', 'Tesla', 'Ford', 'Volvo'];
    const fuelTypes = ['Gasolina', 'Diesel', 'Híbrido', 'Elétrico'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

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
        if (searchFuel) params.append('fuel_type', searchFuel);
        if (searchMaxPrice < 100000) params.append('max_price', searchMaxPrice);
        if (searchMinYear) params.append('min_year', searchMinYear);
        navigate(`/viaturas?${params.toString()}`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0 }).format(price);
    };

    // Get unique stats
    const uniqueBrands = [...new Set(vehicles.map(v => v.brand))].length;
    const avgPrice = vehicles.length > 0 
        ? Math.round(vehicles.reduce((acc, v) => acc + v.price, 0) / vehicles.length)
        : 0;

    return (
        <main className="pt-16 md:pt-20">
            {/* ============================================
                HERO SECTION - With Background Image
                ============================================ */}
            <section className="min-h-[95vh] flex flex-col justify-center relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img 
                        src={HERO_BG} 
                        alt="" 
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="container-site relative z-10 py-16 md:py-24">
                    <div className="max-w-4xl">
                        {/* Label com linha vermelha */}
                        <div className="flex items-center gap-4 animate-fade-up">
                            <div className="dani-line-short"></div>
                            <span className="text-[11px] font-medium tracking-widest uppercase text-white/60">
                                Stand de Automóveis · Coimbra
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] text-white mt-6 animate-fade-up delay-100">
                            Encontre<br/>
                            <span className="text-[#E60000]">o seu.</span>
                        </h1>

                        {/* Frase autoral */}
                        <p className="text-white/60 mt-6 md:mt-8 max-w-md text-base md:text-lg leading-relaxed animate-fade-up delay-200">
                            Escolhidos um a um. Sem ruído, sem promessas vazias. Só carros de qualidade comprovada.
                        </p>

                        {/* ================================
                            SEARCH BLOCK - Enhanced with Slider
                            ================================ */}
                        <form 
                            onSubmit={handleSearch}
                            className="mt-10 md:mt-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 md:p-6 rounded-sm shadow-2xl animate-fade-up delay-300"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {/* Brand Select */}
                                <div>
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

                                {/* Fuel Type */}
                                <div>
                                    <label className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2">
                                        Combustível
                                    </label>
                                    <select
                                        value={searchFuel}
                                        onChange={(e) => setSearchFuel(e.target.value)}
                                        className="input-style"
                                    >
                                        <option value="">Todos</option>
                                        {fuelTypes.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2">
                                        Ano (desde)
                                    </label>
                                    <select
                                        value={searchMinYear}
                                        onChange={(e) => setSearchMinYear(e.target.value)}
                                        className="input-style"
                                    >
                                        <option value="">Qualquer ano</option>
                                        {years.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="btn-primary w-full"
                                    >
                                        <Search size={16} />
                                        Pesquisar
                                    </button>
                                </div>
                            </div>

                            {/* Price Slider */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
                                        Preço Máximo
                                    </label>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {searchMaxPrice >= 100000 ? 'Sem limite' : `${formatPrice(searchMaxPrice)}€`}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="100000"
                                    step="1000"
                                    value={searchMaxPrice}
                                    onChange={(e) => setSearchMaxPrice(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-[#E60000] slider-thumb"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>5.000€</span>
                                    <span>25.000€</span>
                                    <span>50.000€</span>
                                    <span>75.000€</span>
                                    <span>100.000€+</span>
                                </div>
                            </div>
                        </form>

                        {/* Quick Stats - Simplified */}
                        <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-6 md:gap-10 animate-fade-up delay-400">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                                    <CheckCircle size={18} className="text-green-400" />
                                </div>
                                <span className="text-sm text-white/70">100% Revistos</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                                    <Shield size={18} className="text-blue-400" />
                                </div>
                                <span className="text-sm text-white/70">Garantia Incluída</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                                    <Star size={18} className="text-yellow-400" />
                                </div>
                                <span className="text-sm text-white/70">+500 Clientes Satisfeitos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* ============================================
                QUICK CATEGORIES - New Section
                ============================================ */}
            <section className="py-12 md:py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="container-site">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link 
                            to="/viaturas?fuel_type=Elétrico"
                            className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-sm hover:bg-[#E60000] transition-all duration-300"
                        >
                            <Fuel size={24} className="text-[#E60000] group-hover:text-white transition-colors" />
                            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                                Elétricos
                            </h3>
                            <p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors mt-1">
                                Zero emissões
                            </p>
                        </Link>
                        <Link 
                            to="/viaturas?fuel_type=Híbrido"
                            className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-sm hover:bg-[#E60000] transition-all duration-300"
                        >
                            <Settings size={24} className="text-[#E60000] group-hover:text-white transition-colors" />
                            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                                Híbridos
                            </h3>
                            <p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors mt-1">
                                Máxima eficiência
                            </p>
                        </Link>
                        <Link 
                            to="/viaturas?max_price=15000"
                            className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-sm hover:bg-[#E60000] transition-all duration-300"
                        >
                            <Car size={24} className="text-[#E60000] group-hover:text-white transition-colors" />
                            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                                Até 15.000€
                            </h3>
                            <p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors mt-1">
                                Melhor custo-benefício
                            </p>
                        </Link>
                        <Link 
                            to="/viaturas?min_year=2022"
                            className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-sm hover:bg-[#E60000] transition-all duration-300"
                        >
                            <Calendar size={24} className="text-[#E60000] group-hover:text-white transition-colors" />
                            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                                Recentes
                            </h3>
                            <p className="text-sm text-gray-500 group-hover:text-white/70 transition-colors mt-1">
                                De 2022 em diante
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============================================
                FEATURED VEHICLES
                ============================================ */}
            <section className="py-20 md:py-28">
                <div className="container-site">
                    {/* Section Header */}
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
                WHY US SECTION - New
                ============================================ */}
            <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
                <div className="container-site">
                    <div className="flex items-start gap-5 md:gap-6 mb-12">
                        <span className="section-number pt-2">02</span>
                        <div>
                            <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                Porquê nós
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                A diferença<br/>
                                <span className="text-[#E60000]">dANI.PT</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={24} className="text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Inspeção Rigorosa</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Todas as viaturas passam por uma inspeção completa de +150 pontos antes de entrar no nosso stock.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                                <Shield size={24} className="text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Garantia Real</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Oferecemos garantia mínima de 12 meses em todas as viaturas. Sem letras pequenas.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
                                <Star size={24} className="text-yellow-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Histórico Completo</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Acesso total ao histórico de cada viatura: manutenções, quilometragem real, donos anteriores.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-100 dark:border-gray-700">
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                <MessageCircle size={24} className="text-[#E60000]" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Apoio Dedicado</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Acompanhamento personalizado antes, durante e após a compra. Estamos aqui para si.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                BRAND STATEMENT
                ============================================ */}
            <section className="bg-gray-900 dark:bg-black py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 dark:from-black dark:to-black"></div>
                
                <div className="container-site relative z-10">
                    <div className="flex items-start gap-6 md:gap-8">
                        <div className="hidden md:block w-[2px] h-28 bg-[#E60000] rounded-full"></div>
                        
                        <div className="max-w-3xl">
                            <span className="section-number text-white/20">03</span>
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
            <section className="py-20 md:py-28 bg-white dark:bg-gray-800">
                <div className="container-site">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
                        <div className="flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">04</span>
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
                CONTACT INFO BAR - New
                ============================================ */}
            <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="container-site">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin size={20} className="text-[#E60000]" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Localização</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Rua da Casa Meada 12, Antanhol<br/>
                                    3040-584 Coimbra
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Clock size={20} className="text-[#E60000]" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Horário</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Seg—Sex: 09h—19h<br/>
                                    Sábado: 09h—13h
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone size={20} className="text-[#E60000]" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Contacto</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    <a href="tel:+351919190993" className="hover:text-[#E60000] transition-colors">+351 919 190 993</a><br/>
                                    <a href="mailto:daniel.henriques@dani.pt" className="hover:text-[#E60000] transition-colors">daniel.henriques@dani.pt</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                CTA SECTION
                ============================================ */}
            <section className="py-20 md:py-28 bg-white dark:bg-gray-800">
                <div className="container-site">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-16">
                        <div className="lg:max-w-xl flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">05</span>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                    Pronto?
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                    Vamos<br/>conversar.
                                </h2>
                                <p className="text-gray-500 mt-4 md:mt-6 text-sm md:text-base">
                                    Sem pressão, sem compromisso. Estamos aqui para ajudar a encontrar o carro ideal para si.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <a href="tel:+351919190993" className="btn-primary dani-hover-lift">
                                <Phone size={18} />
                                Ligar agora
                            </a>
                            <a 
                                href="https://wa.me/351919190993?text=Olá! Gostava de saber mais sobre as viaturas disponíveis."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline dani-hover-lift"
                            >
                                <MessageCircle size={18} />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
