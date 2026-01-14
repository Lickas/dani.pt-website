import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Phone, MessageCircle, Fuel, Calendar, Gauge, Settings, Palette, Zap, Check } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const VehicleDetail = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(`${API_URL}/vehicles/${id}`);
                setVehicle(response.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', { minimumFractionDigits: 0 }).format(price);
    };

    const formatMileage = (mileage) => {
        return new Intl.NumberFormat('pt-PT').format(mileage);
    };

    if (loading) {
        return (
            <main className="pt-20 min-h-screen">
                <div className="container-site py-12">
                    <div className="h-8 w-32 bg-[#F5F5F5] animate-pulse mb-8"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="aspect-[4/3] bg-[#F5F5F5] animate-pulse"></div>
                        <div className="space-y-4">
                            <div className="h-6 w-24 bg-[#F5F5F5] animate-pulse"></div>
                            <div className="h-12 w-64 bg-[#F5F5F5] animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!vehicle) {
        return (
            <main className="pt-20 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-4xl text-[#1A1A1A] mb-4">
                        Viatura não encontrada
                    </h1>
                    <Link to="/viaturas" className="btn-primary">
                        Ver todas as viaturas
                    </Link>
                </div>
            </main>
        );
    }

    const images = vehicle.images?.length > 0 
        ? vehicle.images 
        : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200'];

    const specs = [
        { icon: Calendar, label: 'Ano', value: vehicle.year },
        { icon: Fuel, label: 'Combustível', value: vehicle.fuel_type },
        { icon: Gauge, label: 'Quilómetros', value: `${formatMileage(vehicle.mileage)} km` },
        { icon: Settings, label: 'Caixa', value: vehicle.transmission },
        { icon: Palette, label: 'Cor', value: vehicle.color },
        { icon: Zap, label: 'Potência', value: vehicle.power },
    ];

    const whatsappMsg = encodeURIComponent(
        `Olá! Estou interessado no ${vehicle.brand} ${vehicle.model} (${vehicle.year}) a ${formatPrice(vehicle.price)}€.`
    );

    return (
        <main className="pt-20">
            <div className="container-site py-8 md:py-12">
                {/* Back Link */}
                <Link 
                    to="/viaturas"
                    className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#1A1A1A] transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* ============================================
                        IMAGE GALLERY - Left Side
                        ============================================ */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Main Image */}
                        <div className="aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                            <img
                                src={images[selectedImage]}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-[4/3] overflow-hidden ${
                                            selectedImage === index 
                                                ? 'ring-2 ring-[#E60000]' 
                                                : 'opacity-60 hover:opacity-100'
                                        } transition-all`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Imagem ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ============================================
                        DETAILS - Right Side
                        ============================================ */}
                    <div className="lg:col-span-5">
                        {/* Brand */}
                        <span className="label-style text-[#999]">
                            {vehicle.brand}
                        </span>

                        {/* Model */}
                        <h1 className="font-display text-5xl md:text-6xl text-[#1A1A1A] mt-2 leading-none">
                            {vehicle.model}
                        </h1>

                        {/* Price */}
                        <div className="mt-6 pb-6 border-b border-[#E8E8E8]">
                            <span className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">
                                {formatPrice(vehicle.price)}€
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="py-6 flex flex-col sm:flex-row gap-3 border-b border-[#E8E8E8]">
                            <a href="tel:+351919190993" className="btn-primary flex-1 justify-center">
                                <Phone size={18} />
                                Ligar
                            </a>
                            <a 
                                href={`https://wa.me/351919190993?text=${whatsappMsg}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline flex-1 justify-center"
                            >
                                <MessageCircle size={18} />
                                WhatsApp
                            </a>
                        </div>

                        {/* Specs Grid */}
                        <div className="py-6 border-b border-[#E8E8E8]">
                            <div className="grid grid-cols-2 gap-4">
                                {specs.map((spec) => (
                                    <div key={spec.label} className="flex items-center gap-3">
                                        <spec.icon size={18} className="text-[#999]" />
                                        <div>
                                            <span className="block text-xs text-[#999] uppercase tracking-wider">
                                                {spec.label}
                                            </span>
                                            <span className="text-sm font-medium text-[#1A1A1A]">
                                                {spec.value || '—'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        {vehicle.description && (
                            <div className="py-6 border-b border-[#E8E8E8]">
                                <h3 className="label-style text-[#999] mb-3">Descrição</h3>
                                <p className="text-[#666] leading-relaxed">
                                    {vehicle.description}
                                </p>
                            </div>
                        )}

                        {/* Features */}
                        {vehicle.features?.length > 0 && (
                            <div className="py-6">
                                <h3 className="label-style text-[#999] mb-3">Equipamento</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {vehicle.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-[#666]">
                                            <Check size={14} className="text-[#E60000]" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
