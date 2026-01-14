import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { VehicleCard } from '../components/VehicleCard';
import { FilterBar } from '../components/FilterBar';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        brand: '',
        fuel_type: '',
        min_year: '',
        min_price: '',
        max_price: ''
    });

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
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            brand: '',
            fuel_type: '',
            min_year: '',
            min_price: '',
            max_price: ''
        });
    };

    return (
        <main className="pt-16 md:pt-20 pb-20 md:pb-0">
            {/* Header */}
            <section className="bg-[#F4F4F4] py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                        As nossas viaturas
                    </span>
                    <h1 className="font-archivo font-black text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mt-2">
                        Encontre o seu<br />
                        próximo carro
                    </h1>
                    <p className="text-[#666666] mt-4 max-w-lg">
                        Explore a nossa seleção de viaturas usadas de qualidade. 
                        Use os filtros para encontrar exatamente o que procura.
                    </p>
                </div>
            </section>

            {/* Filters & Grid */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    {/* Filters */}
                    <div className="mb-8">
                        <FilterBar 
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClear={handleClearFilters}
                        />
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-sm text-[#666666]">
                            {loading ? 'A carregar...' : `${vehicles.length} viaturas encontradas`}
                        </p>
                    </div>

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div 
                                    key={i}
                                    className="bg-[#F4F4F4] rounded-[4px] h-80 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : vehicles.length > 0 ? (
                        <div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            data-testid="vehicles-grid"
                        >
                            {vehicles.map((vehicle, index) => (
                                <div 
                                    key={vehicle.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-[#666666] text-lg">
                                Não foram encontradas viaturas com os filtros selecionados.
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="mt-4 text-[#E60000] font-semibold hover:underline"
                                data-testid="no-results-clear"
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
