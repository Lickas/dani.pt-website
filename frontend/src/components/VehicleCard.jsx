import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Gauge, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

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
            }, 2500);
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
                className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-sm"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setCurrentImage(0);
                }}
            >
                {/* Red accent line - appears on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E60000] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10"></div>
                
                {/* Image with smooth transition */}
                <div className="relative w-full h-full">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                                idx === currentImage 
                                    ? 'opacity-100 scale-100' 
                                    : 'opacity-0 scale-105'
                            } ${isHovering ? 'group-hover:scale-105' : ''}`}
                            loading="lazy"
                        />
                    ))}
                </div>
                
                {/* Navigation Arrows - Show on hover if multiple images */}
                {images.length > 1 && (
                    <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            onClick={prevImage}
                            className="w-8 h-8 bg-white/90 dark:bg-black/70 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors rounded-sm"
                            aria-label="Imagem anterior"
                        >
                            <ChevronLeft size={16} className="text-gray-800 dark:text-white" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="w-8 h-8 bg-white/90 dark:bg-black/70 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-colors rounded-sm"
                            aria-label="Próxima imagem"
                        >
                            <ChevronRight size={16} className="text-gray-800 dark:text-white" />
                        </button>
                    </div>
                )}

                {/* Image Indicators - Minimalist dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <span 
                                key={idx} 
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    idx === currentImage 
                                        ? 'bg-white w-4' 
                                        : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
                
                {/* Featured Badge - More elegant */}
                {vehicle.is_featured && (
                    <div className="absolute top-3 left-3 bg-[#E60000] text-white px-2.5 py-1 rounded-sm">
                        <span className="text-[10px] font-semibold tracking-wider uppercase">
                            Destaque
                        </span>
                    </div>
                )}

                {/* Sold Overlay */}
                {vehicle.is_sold && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center">
                        <span className="font-display text-3xl text-white tracking-wider">VENDIDO</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="pt-4 space-y-2">
                {/* Brand with animated accent */}
                <div className="flex items-center gap-2">
                    <div className="w-0 group-hover:w-5 h-[2px] bg-[#E60000] transition-all duration-300"></div>
                    <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                        {vehicle.brand}
                    </span>
                </div>
                
                {/* Model name */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#E60000] transition-colors duration-200 leading-tight">
                    {vehicle.model}
                </h3>

                {/* Specs row */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-0.5">
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {vehicle.year}
                    </span>
                    <span className="w-px h-3 bg-gray-200 dark:bg-gray-700"></span>
                    <span className="flex items-center gap-1">
                        <Gauge size={12} />
                        {formatMileage(vehicle.mileage)} km
                    </span>
                    <span className="w-px h-3 bg-gray-200 dark:bg-gray-700"></span>
                    <span className="flex items-center gap-1">
                        <Fuel size={12} />
                        {vehicle.fuel_type}
                    </span>
                </div>

                {/* Price */}
                <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(vehicle.price)}
                    </span>
                    <span className="text-sm font-medium text-gray-400">€</span>
                </div>
            </div>
        </Link>
    );
};
