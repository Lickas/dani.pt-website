import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, X, SlidersHorizontal, Grid, List } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Vehicles = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filter state from URL params
    const [filters, setFilters] = useState({
        brand: searchParams.get('brand') || '',
        fuel_type: searchParams.get('fuel_type') || '',
        min_year: searchParams.get('min_year') || '',
        max_price: parseInt(searchParams.get('max_price')) || 100000
    });

    const brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Peugeot', 'Toyota', 'Renault', 'Tesla', 'Ford', 'Volvo'];
    const fuelTypes = ['Gasolina', 'Diesel', 'Híbrido', 'Elétrico'];
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchVehicles();
    }, [filters]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.fuel_type) params.append('fuel_type', filters.fuel_type);
            if (filters.min_year) params.append('min_year', filters.min_year);
            if (filters.max_price < 100000) params.append('max_price', filters.max_price);
            
            const response = await axios.get(`${API_URL}/vehicles?${params.toString()}`);
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        // Update URL
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v && (k !== 'max_price' || v < 100000)) {
                params.set(k, v);
            }
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ brand: '', fuel_type: '', min_year: '', max_price: 100000 });
        setSearchParams({});
    };

    const hasFilters = filters.brand || filters.fuel_type || filters.min_year || filters.max_price < 100000;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0 }).format(price);
    };

    return (
        <main className="pt-16 md:pt-20">
            {/* ============================================
                PAGE HEADER
                ============================================ */}
            <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16 border-b border-gray-100 dark:border-gray-800">
                <div className="container-site">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <div className="w-[2px] h-16 bg-[#E60000] hidden md:block"></div>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
                                    Catálogo
                                </span>
                                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white mt-2">
                                    Viaturas
                                </h1>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Nada escondido. Só qualidade comprovada.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                {loading ? '...' : `${vehicles.length} viaturas`}
                            </span>
                            {/* View toggle */}
                            <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                FILTERS + GRID
                ============================================ */}
            <section className="py-8 md:py-12">
                <div className="container-site">
                    {/* Filter Bar */}
                    <div className="mb-8">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-sm w-full justify-center"
                        >
                            <SlidersHorizontal size={18} />
                            Filtros
                            {hasFilters && (
                                <span className="w-2 h-2 bg-[#E60000] rounded-full"></span>
                            )}
                        </button>

                        {/* Filters Grid */}
                        <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white dark:bg-gray-800 p-5 md:p-6 rounded-sm border border-gray-100 dark:border-gray-700`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {/* Brand */}
                                <div>
                                    <label className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2 block">
                                        Marca
                                    </label>
                                    <select
                                        value={filters.brand}
                                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                                        className="input-style"
                                    >
                                        <option value="">Todas</option>
                                        {brands.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Fuel */}
                                <div>
                                    <label className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2 block">
                                        Combustível
                                    </label>
                                    <select
                                        value={filters.fuel_type}
                                        onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
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
                                    <label className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2 block">
                                        Ano (desde)
                                    </label>
                                    <select
                                        value={filters.min_year}
                                        onChange={(e) => handleFilterChange('min_year', e.target.value)}
                                        className="input-style"
                                    >
                                        <option value="">Qualquer</option>
                                        {years.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    {hasFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-600 hover:bg-[#E60000] px-4 py-3 rounded-sm w-full transition-colors"
                                        >
                                            <X size={16} />
                                            Limpar filtros
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Price Slider */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
                                        Preço Máximo
                                    </label>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {filters.max_price >= 100000 ? 'Sem limite' : `${formatPrice(filters.max_price)}€`}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="100000"
                                    step="1000"
                                    value={filters.max_price}
                                    onChange={(e) => handleFilterChange('max_price', parseInt(e.target.value))}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>5.000€</span>
                                    <span>25.000€</span>
                                    <span>50.000€</span>
                                    <span>75.000€</span>
                                    <span>100.000€+</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active filters pills */}
                    {hasFilters && (
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <span className="text-xs text-gray-400">Filtros ativos:</span>
                            {filters.brand && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 rounded-full">
                                    {filters.brand}
                                    <button onClick={() => handleFilterChange('brand', '')} className="hover:text-[#E60000]">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {filters.fuel_type && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 rounded-full">
                                    {filters.fuel_type}
                                    <button onClick={() => handleFilterChange('fuel_type', '')} className="hover:text-[#E60000]">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {filters.min_year && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 rounded-full">
                                    Desde {filters.min_year}
                                    <button onClick={() => handleFilterChange('min_year', '')} className="hover:text-[#E60000]">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {filters.max_price < 100000 && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 rounded-full">
                                    Até {formatPrice(filters.max_price)}€
                                    <button onClick={() => handleFilterChange('max_price', 100000)} className="hover:text-[#E60000]">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-sm skeleton"></div>
                                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded skeleton"></div>
                                    <div className="h-5 w-40 bg-gray-100 dark:bg-gray-800 rounded skeleton"></div>
                                </div>
                            ))}
                        </div>
                    ) : vehicles.length > 0 ? (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {vehicles.map((vehicle, index) => (
                                <div 
                                    key={vehicle.id}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Nenhuma viatura encontrada
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Tente ajustar os filtros para ver mais resultados.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="btn-primary"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};
