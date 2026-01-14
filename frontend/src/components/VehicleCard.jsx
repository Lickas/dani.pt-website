import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge } from 'lucide-react';

export const VehicleCard = ({ vehicle }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatMileage = (mileage) => {
        return new Intl.NumberFormat('pt-PT').format(mileage);
    };

    return (
        <Link
            to={`/viaturas/${vehicle.id}`}
            className="group block"
            data-testid={`vehicle-card-${vehicle.id}`}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-[#F5F5F5] overflow-hidden mb-4">
                <img
                    src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover img-scale"
                    loading="lazy"
                />
                
                {/* Featured Badge */}
                {vehicle.is_featured && (
                    <div className="absolute top-0 left-0 bg-[#E60000] text-white px-3 py-1">
                        <span className="text-[10px] font-semibold tracking-wider uppercase">
                            Destaque
                        </span>
                    </div>
                )}

                {/* Sold Overlay */}
                {vehicle.is_sold && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="font-display text-4xl text-white">VENDIDO</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-2">
                {/* Brand */}
                <span className="label-style text-[#999]">
                    {vehicle.brand}
                </span>
                
                {/* Model */}
                <h3 className="text-xl font-semibold text-[#1A1A1A] group-hover:text-[#E60000] transition-colors leading-tight">
                    {vehicle.model}
                </h3>

                {/* Specs Row */}
                <div className="flex items-center gap-4 text-xs text-[#666] pt-1">
                    <span>{vehicle.year}</span>
                    <span className="w-1 h-1 bg-[#CCC] rounded-full"></span>
                    <span className="flex items-center gap-1">
                        <Gauge size={12} />
                        {formatMileage(vehicle.mileage)} km
                    </span>
                    <span className="w-1 h-1 bg-[#CCC] rounded-full"></span>
                    <span className="flex items-center gap-1">
                        <Fuel size={12} />
                        {vehicle.fuel_type}
                    </span>
                </div>

                {/* Price */}
                <div className="pt-2">
                    <span className="text-2xl font-bold text-[#1A1A1A]">
                        {formatPrice(vehicle.price)}€
                    </span>
                </div>
            </div>
        </Link>
    );
};
