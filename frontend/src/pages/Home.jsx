import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, ChevronRight, ChevronLeft, ChevronUp, Shield, CheckCircle, Star, Phone, MessageCircle, MapPin, Clock, Calendar, Car, Sparkles, Award, ThumbsUp, Zap, Tag } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { vehiclesAPI, campaignsAPI } from '../utils/apiService';
import { BrandMarquee } from '../components/BrandMarquee';

// Hero background image
const HERO_BG = "https://images.unsplash.com/photo-1701241966709-5371c9bf0f1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwwfHx8YmxhY2t8MTc2ODQyODQ3M3ww&ixlib=rb-4.1.0&q=85&w=1920";

export const Home = () => {
    const [vehicles, setVehicles] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [featuredVehicles, setFeaturedVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const navigate = useNavigate();
    
    // Carousel ref for campaigns
    const campaignCarouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Search state
    const [searchBrand, setSearchBrand] = useState('');
    const [searchMaxPrice, setSearchMaxPrice] = useState('');
    const [searchMinYear, setSearchMinYear] = useState('');

    const brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Peugeot', 'Toyota', 'Renault', 'Tesla', 'Ford', 'Volvo'];
    const priceRanges = [
        { label: 'Até 10.000€', value: '10000' },
        { label: 'Até 15.000€', value: '15000' },
        { label: 'Até 20.000€', value: '20000' },
        { label: 'Até 30.000€', value: '30000' },
        { label: 'Até 50.000€', value: '50000' },
        { label: 'Até 75.000€', value: '75000' },
        { label: 'Sem limite', value: '' },
    ];
    const years = Array.from({ length: new Date().getFullYear() - 1994 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscar viaturas e campanhas com fallback autom\u00e1tico para mock data
                const [vehiclesData, campaignsData] = await Promise.all([
                    vehiclesAPI.getAll(),
                    campaignsAPI.getAll()
                ]);
                
                // PROGRAMA\u00c7\u00c3O DEFENSIVA: Garantir que sempre temos arrays v\u00e1lidos
                const safeVehicles = Array.isArray(vehiclesData) ? vehiclesData : [];
                const safeCampaigns = Array.isArray(campaignsData) ? campaignsData : [];
                
                setVehicles(safeVehicles);
                setCampaigns(safeCampaigns);
                
                // Filtrar viaturas em destaque com seguran\u00e7a
                const featured = safeVehicles
                    .filter(v => v && v.is_featured)
                    .slice(0, 3);
                setFeaturedVehicles(featured);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                // Em caso de erro cr\u00edtico, garantir arrays vazios
                setVehicles([]);
                setCampaigns([]);
                setFeaturedVehicles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check carousel scroll state
    const checkCarouselScroll = () => {
        const carousel = campaignCarouselRef.current;
        if (carousel) {
            setCanScrollLeft(carousel.scrollLeft > 0);
            setCanScrollRight(carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 10);
        }
    };

    useEffect(() => {
        checkCarouselScroll();
        const carousel = campaignCarouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', checkCarouselScroll);
            return () => carousel.removeEventListener('scroll', checkCarouselScroll);
        }
    }, [campaigns]);

    const scrollCarousel = (direction) => {
        const carousel = campaignCarouselRef.current;
        if (carousel) {
            const scrollAmount = 400;
            carousel.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchBrand) params.append('brand', searchBrand);
        if (searchMaxPrice) params.append('max_price', searchMaxPrice);
        if (searchMinYear) params.append('min_year', searchMinYear);
        navigate(`/viaturas?${params.toString()}`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0 }).format(price);
    };

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
                            <span className="text-glow-red">o seu.</span>
                        </h1>

                        {/* Tagline única */}
                        <p className="text-white/60 mt-6 md:mt-8 max-w-md text-base md:text-lg leading-relaxed animate-fade-up delay-200">
                            Escolhidos um a um. Sem ruído, sem promessas vazias. Só carros de qualidade comprovada.
                        </p>

                        {/* ================================
                            SEARCH BLOCK - Clean Layout
                            ================================ */}
                        <form 
                            onSubmit={handleSearch}
                            className="mt-10 md:mt-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-5 md:p-6 rounded-sm shadow-2xl animate-fade-up delay-300"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                                {/* Price Range */}
                                <div>
                                    <label className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2">
                                        Preço Máximo
                                    </label>
                                    <select
                                        value={searchMaxPrice}
                                        onChange={(e) => setSearchMaxPrice(e.target.value)}
                                        className="input-style"
                                    >
                                        {priceRanges.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
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
                                        <optgroup label="Recentes (2020+)">
                                            {years.filter(y => y >= 2020).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="2010 - 2019">
                                            {years.filter(y => y >= 2010 && y < 2020).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="2000 - 2009">
                                            {years.filter(y => y >= 2000 && y < 2010).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Clássicos (antes de 2000)">
                                            {years.filter(y => y < 2000).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        className="btn-primary w-full btn-glow"
                                    >
                                        <Search size={16} />
                                        Pesquisar
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Trust Badges - Simplified */}
                        <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-6 md:gap-10 animate-fade-up delay-400">
                            <div className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <CheckCircle size={18} className="text-green-400" />
                                </div>
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors">100% Revistos</span>
                            </div>
                            <div className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <Star size={18} className="text-yellow-400" />
                                </div>
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors">+500 Clientes Satisfeitos</span>
                            </div>
                            <div className="flex items-center gap-3 group cursor-default">
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <Award size={18} className="text-blue-400" />
                                </div>
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors">15 Anos de Experiência</span>
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
                UNIQUE VALUE PROPOSITION - Marketing Section
                ============================================ */}
            <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
                <div className="container-site">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#E60000]/10 text-[#E60000] text-xs font-semibold tracking-wider uppercase rounded-full mb-4 hover-glow-red">
                            <Sparkles size={14} />
                            A Diferença dANI.PT
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl text-gray-900 dark:text-white">
                            Não vendemos carros.<br/>
                            <span className="text-glow-red">Entregamos confiança.</span>
                        </h2>
                        <p className="text-gray-500 mt-4 text-base md:text-lg">
                            Cada viatura é uma promessa cumprida. Sem surpresas, sem letras pequenas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="group p-8 bg-gray-50 dark:bg-gray-800 rounded-sm hover:bg-[#E60000] transition-all duration-300 text-center card-hover-glow">
                            <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-700 group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                                <Shield size={28} className="text-[#E60000] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors mb-2">
                                Zero Riscos
                            </h3>
                            <p className="text-gray-500 group-hover:text-white/80 transition-colors text-sm">
                                Inspeção de 150+ pontos. Se não passa no nosso crivo, não entra no nosso stand.
                            </p>
                        </div>
                        <div className="group p-8 bg-gray-50 dark:bg-gray-800 rounded-sm hover:bg-[#E60000] transition-all duration-300 text-center card-hover-glow">
                            <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-700 group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                                <ThumbsUp size={28} className="text-[#E60000] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors mb-2">
                                Preço Justo
                            </h3>
                            <p className="text-gray-500 group-hover:text-white/80 transition-colors text-sm">
                                Preços transparentes, sem negociações cansativas. O preço que vê é o preço final.
                            </p>
                        </div>
                        <div className="group p-8 bg-gray-50 dark:bg-gray-800 rounded-sm hover:bg-[#E60000] transition-all duration-300 text-center card-hover-glow">
                            <div className="w-16 h-16 mx-auto bg-white dark:bg-gray-700 group-hover:bg-white/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                                <Zap size={28} className="text-[#E60000] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors mb-2">
                                Entrega Rápida
                            </h3>
                            <p className="text-gray-500 group-hover:text-white/80 transition-colors text-sm">
                                Documentação tratada em 48h. Saia a conduzir no mesmo dia da compra.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                BRAND MARQUEE
                ============================================ */}
            <BrandMarquee />

            {/* ============================================
                QUICK CATEGORIES
                ============================================ */}
            <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
                <div className="container-site">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-display text-2xl md:text-3xl text-gray-900 dark:text-white">
                            Pesquisa Rápida
                        </h3>
                        <Link 
                            to="/viaturas"
                            className="text-sm font-medium text-[#E60000] hover:underline link-glow"
                        >
                            Ver todas →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link 
                            to="/viaturas?fuel_type=Elétrico"
                            className="group p-5 bg-white dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-700 hover:border-[#E60000] hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
                        >
                            <Zap size={22} className="text-[#E60000]" />
                            <h4 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-[#E60000] transition-colors">
                                Elétricos
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">Zero emissões</p>
                        </Link>
                        <Link 
                            to="/viaturas?max_price=15000"
                            className="group p-5 bg-white dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-700 hover:border-[#E60000] hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
                        >
                            <Tag size={22} className="text-[#E60000]" />
                            <h4 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-[#E60000] transition-colors">
                                Até 15.000€
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">Melhor custo-benefício</p>
                        </Link>
                        <Link 
                            to="/viaturas?min_year=2022"
                            className="group p-5 bg-white dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-700 hover:border-[#E60000] hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
                        >
                            <Calendar size={22} className="text-[#E60000]" />
                            <h4 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-[#E60000] transition-colors">
                                Recentes
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">De 2022 em diante</p>
                        </Link>
                        <Link 
                            to="/viaturas?brand=BMW"
                            className="group p-5 bg-white dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-700 hover:border-[#E60000] hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
                        >
                            <Car size={22} className="text-[#E60000]" />
                            <h4 className="mt-3 font-semibold text-gray-900 dark:text-white group-hover:text-[#E60000] transition-colors">
                                Premium
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">BMW, Mercedes, Audi</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============================================
                FEATURED VEHICLES - Section 01
                ============================================ */}
            <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
                <div className="container-site">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
                        <div className="flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">01</span>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                    Seleção Premium
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                    Em <span className="text-glow-red">destaque</span>
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
                    ) : featuredVehicles.length > 0 ? (
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
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Nenhuma viatura em destaque no momento.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================
                TESTIMONIAL / BRAND STATEMENT - Section 02
                ============================================ */}
            <section className="bg-gray-900 dark:bg-black py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, #E60000 0%, transparent 50%)'
                    }}></div>
                </div>
                
                <div className="container-site relative z-10">
                    <div className="flex items-start gap-5 md:gap-6 mb-8">
                        <span className="section-number text-white/20 pt-2">02</span>
                    </div>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-16 h-1 bg-[#E60000] mx-auto mb-8 glow-bar"></div>
                        <blockquote className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                            "Comprar um carro usado<br/>
                            não tem de ser uma<br/>
                            <span className="text-glow-red">aventura de risco."</span>
                        </blockquote>
                        <p className="text-white/40 mt-8 text-sm uppercase tracking-widest">
                            — Daniel Henriques, Fundador
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================================
                ALL VEHICLES PREVIEW - Section 03
                ============================================ */}
            <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
                <div className="container-site">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
                        <div className="flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">03</span>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                    Stock Atual
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                    Últimas <span className="text-glow-red">entradas</span>
                                </h2>
                            </div>
                        </div>
                        <Link 
                            to="/viaturas"
                            className="btn-secondary dani-hover-lift btn-glow-dark"
                        >
                            Ver catálogo completo
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {!loading && vehicles.length > 0 && (
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
                    
                    {!loading && vehicles.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">A carregar viaturas...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ============================================
                CAMPAIGNS SECTION - Section 04 (MOVED TO END)
                ============================================ */}
            <section className="py-20 md:py-28 bg-[#E60000] relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="container-site relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div className="flex items-start gap-5 md:gap-6">
                            <span className="section-number text-white/30 pt-2">04</span>
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white text-xs font-semibold tracking-wider uppercase rounded-full mb-4">
                                    <Tag size={12} />
                                    Ofertas Especiais
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white">
                                    Campanhas<br/>em vigor
                                </h2>
                            </div>
                        </div>
                        <Link 
                            to="/campanhas"
                            className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
                        >
                            Ver todas as campanhas
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative">
                        {/* Left Arrow */}
                        {canScrollLeft && (
                            <button
                                onClick={() => scrollCarousel('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                                aria-label="Anterior"
                            >
                                <ChevronLeft size={24} className="text-[#E60000]" />
                            </button>
                        )}

                        {/* Right Arrow */}
                        {canScrollRight && (
                            <button
                                onClick={() => scrollCarousel('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
                                aria-label="Próximo"
                            >
                                <ChevronRight size={24} className="text-[#E60000]" />
                            </button>
                        )}

                        {/* Campaigns Carousel */}
                        <div 
                            ref={campaignCarouselRef}
                            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {Array.isArray(campaigns) && campaigns.length > 0 ? (
                                campaigns.map((campaign, index) => (
                                    <Link 
                                        to={`/campanhas/${campaign.id}`}
                                        key={campaign.id}
                                        className="flex-shrink-0 w-[350px] md:w-[400px] bg-white rounded-sm overflow-hidden group hover:shadow-2xl transition-shadow snap-start animate-fade-up block"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {campaign.image_url && (
                                            <div className="aspect-[16/9] overflow-hidden">
                                                <img 
                                                    src={campaign.image_url} 
                                                    alt={campaign.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            {campaign.discount_percentage && (
                                                <span className="inline-block px-3 py-1 bg-[#E60000] text-white text-xs font-bold rounded-full mb-3 animate-pulse-subtle">
                                                    -{campaign.discount_percentage}%
                                                </span>
                                            )}
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#E60000] transition-colors">
                                                {campaign.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">
                                                {campaign.description}
                                            </p>
                                            <span className="inline-flex items-center gap-1 mt-4 text-[#E60000] font-semibold text-sm group-hover:underline">
                                                Ver detalhes
                                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="w-full text-center py-12">
                                    <p className="text-white/70">
                                        Estamos a preparar ofertas especiais para si. Fique atento!
                                    </p>
                                    <a 
                                        href="tel:+351919190993"
                                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-[#E60000] font-semibold rounded-sm hover:bg-gray-100 transition-colors"
                                    >
                                        <Phone size={18} />
                                        Ligue para saber mais
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                CONTACT INFO BAR
                ============================================ */}
            <section className="py-12 md:py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="container-site">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#E60000]/20 transition-colors">
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
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#E60000]/20 transition-colors">
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
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 bg-[#E60000]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#E60000]/20 transition-colors">
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
            <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
                <div className="container-site">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-16">
                        <div className="lg:max-w-xl flex items-start gap-5 md:gap-6">
                            <span className="section-number pt-2">05</span>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                    Pronto?
                                </span>
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mt-2">
                                    Vamos<br/><span className="text-glow-red">conversar.</span>
                                </h2>
                                <p className="text-gray-500 mt-4 md:mt-6 text-sm md:text-base">
                                    Sem pressão, sem compromisso. Estamos aqui para ajudar a encontrar o carro ideal para si.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <a href="tel:+351919190993" className="btn-primary dani-hover-lift btn-glow">
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

            {/* ============================================
                SCROLL TO TOP BUTTON
                ============================================ */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#E60000] hover:bg-[#CC0000] text-white rounded-full shadow-lg shadow-red-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    showScrollTop 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                aria-label="Voltar ao topo"
            >
                <ChevronUp size={24} />
            </button>
        </main>
    );
};
