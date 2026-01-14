import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Phone, MessageCircle, Fuel, Calendar, Gauge, Settings, Palette, Zap, Check } from 'lucide-react';
import { Button } from '../components/ui/button';

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
                console.error('Error fetching vehicle:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatMileage = (mileage) => {
        return new Intl.NumberFormat('pt-PT').format(mileage) + ' km';
    };

    const whatsappMessage = vehicle 
        ? encodeURIComponent(`Olá! Estou interessado no ${vehicle.brand} ${vehicle.model} (${vehicle.year}) anunciado no vosso site.`)
        : '';

    if (loading) {
        return (
            <main className="pt-16 md:pt-20 pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 w-32 bg-[#F4F4F4] rounded mb-8" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="aspect-[4/3] bg-[#F4F4F4] rounded-[4px]" />
                            <div className="space-y-4">
                                <div className="h-6 w-24 bg-[#F4F4F4] rounded" />
                                <div className="h-10 w-64 bg-[#F4F4F4] rounded" />
                                <div className="h-12 w-32 bg-[#F4F4F4] rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!vehicle) {
        return (
            <main className="pt-16 md:pt-20 pb-20 md:pb-0">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12 text-center">
                    <h1 className="font-archivo font-bold text-2xl text-[#1A1A1A] mb-4">
                        Viatura não encontrada
                    </h1>
                    <Link to="/viaturas">
                        <Button className="bg-[#E60000] hover:bg-[#CC0000] rounded-[2px]">
                            Voltar às Viaturas
                        </Button>
                    </Link>
                </div>
            </main>
        );
    }

    const specs = [
        { icon: Calendar, label: 'Ano', value: vehicle.year },
        { icon: Fuel, label: 'Combustível', value: vehicle.fuel_type },
        { icon: Gauge, label: 'Quilómetros', value: formatMileage(vehicle.mileage) },
        { icon: Settings, label: 'Transmissão', value: vehicle.transmission },
        { icon: Palette, label: 'Cor', value: vehicle.color },
        { icon: Zap, label: 'Potência', value: vehicle.power },
    ];

    const images = vehicle.images?.length > 0 
        ? vehicle.images 
        : ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'];

    return (
        <main className="pt-16 md:pt-20 pb-20 md:pb-0">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-8 md:py-12">
                {/* Back Link */}
                <Link 
                    to="/viaturas"
                    className="inline-flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors mb-8"
                    data-testid="back-to-vehicles"
                >
                    <ArrowLeft size={16} />
                    Voltar às Viaturas
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-[4/3] bg-[#F4F4F4] rounded-[4px] overflow-hidden">
                            <img
                                src={images[selectedImage]}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                                data-testid="main-vehicle-image"
                            />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-[4/3] rounded-[2px] overflow-hidden border-2 transition-colors ${
                                            selectedImage === index
                                                ? 'border-[#E60000]'
                                                : 'border-transparent hover:border-[#E5E5E5]'
                                        }`}
                                        data-testid={`thumbnail-${index}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${vehicle.brand} ${vehicle.model} - Imagem ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        {/* Header */}
                        <div className="mb-6">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                                {vehicle.brand}
                            </span>
                            <h1 className="font-archivo font-black text-3xl md:text-4xl text-[#1A1A1A] mt-1">
                                {vehicle.model}
                            </h1>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <span className="font-archivo font-black text-4xl md:text-5xl text-[#E60000]">
                                {formatPrice(vehicle.price)}
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <a href="tel:+351919190993" className="flex-1">
                                <Button 
                                    size="lg"
                                    className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white rounded-[2px] font-semibold btn-lift"
                                    data-testid="vehicle-phone-cta"
                                >
                                    <Phone size={18} className="mr-2" />
                                    Ligar Agora
                                </Button>
                            </a>
                            <a 
                                href={`https://wa.me/351919190993?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button 
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-[#E5E5E5] hover:border-[#1A1A1A] rounded-[2px] font-semibold"
                                    data-testid="vehicle-whatsapp-cta"
                                >
                                    <MessageCircle size={18} className="mr-2" />
                                    WhatsApp
                                </Button>
                            </a>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-6 bg-[#F4F4F4] rounded-[4px]">
                            {specs.map((spec) => (
                                <div key={spec.label} className="flex items-start gap-3">
                                    <spec.icon size={18} className="text-[#999999] mt-0.5" />
                                    <div>
                                        <span className="block text-xs text-[#999999] uppercase tracking-wider">
                                            {spec.label}
                                        </span>
                                        <span className="block text-sm font-medium text-[#1A1A1A]">
                                            {spec.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-3">
                                Descrição
                            </h3>
                            <p className="text-[#666666] leading-relaxed">
                                {vehicle.description}
                            </p>
                        </div>

                        {/* Features */}
                        {vehicle.features?.length > 0 && (
                            <div>
                                <h3 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-3">
                                    Equipamento
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {vehicle.features.map((feature, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center gap-2 text-sm text-[#666666]"
                                        >
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
