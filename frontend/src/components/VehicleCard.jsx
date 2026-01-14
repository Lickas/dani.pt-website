import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Calendar, Gauge, Settings } from 'lucide-react';
import { Badge } from './ui/badge';

export const VehicleCard = ({ vehicle, featured = false }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatMileage = (mileage) => {
        return new Intl.NumberFormat('pt-PT').format(mileage) + ' km';
    };

    return (
        <Link
            to={`/viaturas/${vehicle.id}`}
            data-testid={`vehicle-card-${vehicle.id}`}
            className={`group block bg-white border border-[#E5E5E5] rounded-[4px] overflow-hidden card-hover ${
                featured ? 'md:col-span-2' : ''
            }`}
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F4F4]">
                <img
                    src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover img-zoom"
                    loading="lazy"
                />
                {vehicle.is_featured && (
                    <Badge 
                        className="absolute top-4 left-4 bg-[#E60000] text-white rounded-[2px] font-mono text-xs uppercase tracking-wider"
                        data-testid="featured-badge"
                    >
                        Destaque
                    </Badge>
                )}
                {vehicle.is_sold && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="font-archivo font-bold text-2xl text-white uppercase tracking-wider">
                            Vendido
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Brand & Model */}
                <div className="mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#999999]">
                        {vehicle.brand}
                    </span>
                    <h3 className="font-archivo font-bold text-xl text-[#1A1A1A] group-hover:text-[#E60000] transition-colors">
                        {vehicle.model}
                    </h3>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 my-4 py-4 border-y border-[#E5E5E5]">
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <Calendar size={14} className="text-[#999999]" />
                        <span>{vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <Fuel size={14} className="text-[#999999]" />
                        <span>{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <Gauge size={14} className="text-[#999999]" />
                        <span>{formatMileage(vehicle.mileage)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <Settings size={14} className="text-[#999999]" />
                        <span>{vehicle.transmission}</span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-end justify-between">
                    <span className="font-archivo font-black text-2xl text-[#1A1A1A]">
                        {formatPrice(vehicle.price)}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#E60000]">
                        Ver Detalhes →
                    </span>
                </div>
            </div>
        </Link>
    );
};
