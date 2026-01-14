import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';

export const VehicleCard = ({ vehicle }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef(null);

    const images = vehicle.images?.length > 0 
        ? vehicle.images 
        : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'];

    // Auto-rotate images on hover
    useEffect(() => {
        if (isHovering && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImage(prev => (prev + 1) % images.length);
            }, 2000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isHovering, images.length]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0 }).format(price);
    };

    const formatMileage = (mileage) => {
        return new Intl.NumberFormat('pt-PT').format(mileage);
    };

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage(prev => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImage(prev => (prev - 1 + images.length) % images.length);
    };

    return (
        <Link
            to={`/viaturas/${vehicle.id}`}
            className="group block"
            data-testid={`vehicle-card-${vehicle.id}`}
        >
            {/* Image Container */}
            <div 
                className="relative aspect-[4/3] bg-[#F5F5F5] dark:bg-[#1A1A1A] overflow-hidden mb-4"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setCurrentImage(0);
                }}
            >
                {/* Linha vermelha superior - assinatura dANI */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E60000] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <img
                    src={images[currentImage]}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                
                {/* Navigation Arrows - Show on hover if multiple images */}
                {images.length > 1 && (
                    <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={prevImage}
                            className="w-8 h-8 bg-white/90 dark:bg-black/70 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
                        >
                            <ChevronLeft size={18} className="text-[#1A1A1A] dark:text-white" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="w-8 h-8 bg-white/90 dark:bg-black/70 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors"
                        >
                            <ChevronRight size={18} className="text-[#1A1A1A] dark:text-white" />
                        </button>
                    </div>
                )}

                {/* Image Indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, idx) => (
                            <span 
                                key={idx} 
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                    idx === currentImage ? 'bg-white' : 'bg-white/40'
                                }`}
                            />
                        ))}
                    </div>
                )}
                
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
                <span className="label-style text-[#999] dark:text-[#666]">
                    {vehicle.brand}
                </span>
                
                <h3 className="text-xl font-semibold text-[#1A1A1A] dark:text-white group-hover:text-[#E60000] transition-colors leading-tight">
                    {vehicle.model}
                </h3>

                <div className="flex items-center gap-4 text-xs text-[#666] dark:text-[#888] pt-1">
                    <span>{vehicle.year}</span>
                    <span className="w-1 h-1 bg-[#CCC] dark:bg-[#444] rounded-full"></span>
                    <span className="flex items-center gap-1">
                        <Gauge size={12} />
                        {formatMileage(vehicle.mileage)} km
                    </span>
                    <span className="w-1 h-1 bg-[#CCC] dark:bg-[#444] rounded-full"></span>
                    <span className="flex items-center gap-1">
                        <Fuel size={12} />
                        {vehicle.fuel_type}
                    </span>
                </div>

                <div className="pt-2">
                    <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white">
                        {formatPrice(vehicle.price)}€
                    </span>
                </div>
            </div>
        </Link>
    );
};
