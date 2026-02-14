import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { RentingCard } from '../components/RentingCard';
import { rentingAPI } from '../utils/apiService';

export const Renting = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await rentingAPI.getAll(true); // Only active offers
            setOffers(data);
        } catch (error) {
            console.error('Error fetching renting offers:', error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pt-16 md:pt-20">
            {/* Header */}
            <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16 border-b border-gray-100 dark:border-gray-800">
                <div className="container-site">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <div className="w-[2px] h-16 bg-[#E60000] hidden md:block"></div>
                            <div>
                                <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
                                    Serviços
                                </span>
                                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white mt-2">
                                    Renting
                                </h1>
                                <p className="text-gray-500 mt-2 text-sm max-w-xl">
                                    Soluções de mobilidade flexíveis para particulares e empresas.
                                    Tudo incluído, sem preocupações.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-12 md:py-16">
                <div className="container-site">
                    {loading ? (
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-sm shadow-sm overflow-hidden h-96 animate-pulse">
                                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="p-5 space-y-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 w-3/4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2"></div>
                                        <div className="h-20 bg-gray-200 dark:bg-gray-700 w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : offers.length > 0 ? (
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {offers.map((offer, index) => (
                                <div
                                    key={offer.id}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <RentingCard offer={offer} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Search size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Nenhuma oferta disponível
                            </h3>
                            <p className="text-gray-500">
                                De momento não temos ofertas de renting ativas. Por favor contacte-nos.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};
