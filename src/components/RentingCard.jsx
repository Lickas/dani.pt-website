import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const RentingCard = ({ offer }) => {
    // Calculate minimum price
    const getMinPrice = () => {
        if (!offer.pricing_matrix || offer.pricing_matrix.length === 0) return 0;
        return Math.min(...offer.pricing_matrix.map(p => p.price));
    };

    const minPrice = getMinPrice();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0 }).format(price);
    };

    return (
        <Link
            to={`/renting/${offer.id}`}
            className="group block bg-white dark:bg-gray-800 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <img
                    src={offer.images?.[0] || offer.image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'}
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                {/* Badge if category exists */}
                {offer.category === 'business' && (
                     <div className="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-sm">
                        <span className="text-[10px] font-semibold tracking-wider uppercase">
                            Empresas
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-2">
                    <span className="text-[10px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                        {offer.subtitle || 'Renting'}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#E60000] transition-colors duration-200 leading-tight mt-1">
                        {offer.title}
                    </h3>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                    {offer.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Desde</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-[#E60000]">
                                {formatPrice(minPrice)}
                            </span>
                            <span className="text-sm font-medium text-gray-400">€/mês</span>
                        </div>
                    </div>

                    <span className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#E60000] group-hover:text-white transition-all duration-300">
                        <ChevronRight size={16} />
                    </span>
                </div>
            </div>
        </Link>
    );
};
