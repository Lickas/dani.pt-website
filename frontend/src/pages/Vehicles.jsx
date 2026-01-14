import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Vehicles = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter state from URL params
    const [filters, setFilters] = useState({
        brand: searchParams.get('brand') || '',
        fuel_type: searchParams.get('fuel_type') || '',
        min_year: searchParams.get('min_year') || '',
        max_price: searchParams.get('max_price') || ''
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
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            
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
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ brand: '', fuel_type: '', min_year: '', max_price: '' });
        setSearchParams({});
    };

    const hasFilters = Object.values(filters).some(v => v);

    return (
        <main className="pt-20">
            {/* ============================================
                PAGE HEADER
                ============================================ */}
            <section className="bg-[#FAFAFA] py-16 md:py-24">
                <div className="container-site">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="label-style text-[#999]">Catálogo</span>
                            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-[#1A1A1A] mt-2">
                                Viaturas
                            </h1>
                        </div>
                        <p className="text-[#666] md:text-right">
                            {loading ? '...' : vehicles.length} viaturas disponíveis
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================================
                FILTERS + GRID
                ============================================ */}
            <section className="py-12 md:py-16">
                <div className="container-site">
                    {/* Filter Bar */}
                    <div className="mb-8">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 text-sm font-semibold text-[#1A1A1A] mb-4"
                        >
                            <SlidersHorizontal size={18} />
                            Filtros
                            {hasFilters && (
                                <span className="w-2 h-2 bg-[#E60000] rounded-full"></span>
                            )}
                        </button>

                        {/* Filters Grid */}
                        <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {/* Brand */}
                                <div>
                                    <label className="label-style text-[#999] mb-2 block">Marca</label>
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
                                    <label className="label-style text-[#999] mb-2 block">Combustível</label>
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
                                    <label className="label-style text-[#999] mb-2 block">Ano (desde)</label>
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

                                {/* Max Price */}
                                <div>
                                    <label className="label-style text-[#999] mb-2 block">Preço máx.</label>
                                    <input
                                        type="number"
                                        value={filters.max_price}
                                        onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                        placeholder="Ex: 30000"
                                        className="input-style"
                                    />
                                </div>

                                {/* Clear */}
                                <div className="flex items-end">
                                    {hasFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-2 text-sm text-[#666] hover:text-[#E60000] transition-colors"
                                        >
                                            <X size={16} />
                                            Limpar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="divider mb-8"></div>

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[4/3] bg-[#F5F5F5] animate-pulse"></div>
                                    <div className="h-4 w-20 bg-[#F5F5F5] animate-pulse"></div>
                                    <div className="h-6 w-40 bg-[#F5F5F5] animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    ) : vehicles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        <div className="py-24 text-center">
                            <Search size={48} className="mx-auto text-[#E8E8E8] mb-4" />
                            <p className="text-xl text-[#666]">
                                Nenhuma viatura encontrada
                            </p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-[#E60000] font-semibold hover:underline"
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
