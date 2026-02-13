import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { rentingAPI } from '../utils/apiService';
import { Check, ChevronLeft, Calendar, Gauge, Euro, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const RentingDetail = () => {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    // Selection state
    const [duration, setDuration] = useState(null);
    const [mileage, setMileage] = useState(null);
    const [upfront, setUpfront] = useState(null);
    const [price, setPrice] = useState(null);

    useEffect(() => {
        fetchOffer();
    }, [id]);

    const fetchOffer = async () => {
        setLoading(true);
        try {
            const data = await rentingAPI.getById(id);
            setOffer(data);

            // Initialize selection with defaults (lowest price or first option)
            if (data.pricing_matrix && data.pricing_matrix.length > 0) {
                // Sort by price ascending to find default
                const sorted = [...data.pricing_matrix].sort((a, b) => a.price - b.price);
                const best = sorted[0];
                setDuration(best.duration);
                setMileage(best.mileage);
                setUpfront(best.upfront);
                setPrice(best.price);
            }
        } catch (error) {
            console.error('Error fetching offer:', error);
            toast.error('Erro ao carregar oferta.');
        } finally {
            setLoading(false);
        }
    };

    // Update price when selection changes
    useEffect(() => {
        if (!offer || !offer.pricing_matrix) return;

        const match = offer.pricing_matrix.find(p =>
            p.duration === duration &&
            p.mileage === mileage &&
            p.upfront === upfront
        );

        if (match) {
            setPrice(match.price);
        } else {
            setPrice(null);
        }
    }, [duration, mileage, upfront, offer]);

    if (loading) return <div className="pt-32 text-center">Carregando...</div>;
    if (!offer) return <div className="pt-32 text-center">Oferta não encontrada.</div>;

    // Handle images (backward compatibility)
    const images = offer.images && offer.images.length > 0
        ? offer.images
        : [offer.image_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'];

    // Extract unique options for dropdowns
    const durations = [...new Set(offer.pricing_matrix.map(p => p.duration))].sort((a, b) => a - b);
    const mileages = [...new Set(offer.pricing_matrix.map(p => p.mileage))].sort((a, b) => a - b);
    const upfronts = [...new Set(offer.pricing_matrix.map(p => p.upfront))].sort((a, b) => a - b);

    // Format helpers
    const formatPrice = (p) => new Intl.NumberFormat('pt-PT').format(p);
    const formatKm = (k) => new Intl.NumberFormat('pt-PT').format(k);

    const whatsappText = encodeURIComponent(
        `Olá! Estou interessado no Renting do ${offer.title}. Configuração: ${duration} meses, ${formatKm(mileage)}km/ano, Entrada ${upfront}€.`
    );

    return (
        <main className="pt-16 md:pt-20 bg-white dark:bg-[#0A0A0A] min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-gray-50 dark:bg-gray-900 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container-site">
                    <Link to="/renting" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E60000] transition-colors">
                        <ChevronLeft size={16} />
                        Voltar para Renting
                    </Link>
                </div>
            </div>

            <div className="container-site py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Image & Info */}
                    <div className="space-y-8">
                        {/* Main Image */}
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden relative border border-gray-100 dark:border-gray-800">
                             <img
                                src={images[selectedImage]}
                                alt={offer.title}
                                className="w-full h-full object-contain p-4"
                            />
                             {offer.category === 'business' && (
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider shadow-sm">
                                    Empresas
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-[4/3] overflow-hidden rounded-sm border ${
                                            selectedImage === index
                                                ? 'border-[#E60000] ring-1 ring-[#E60000]'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                        } transition-all bg-gray-50 dark:bg-gray-900`}
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

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-display mb-4 text-gray-900 dark:text-white">Sobre a oferta</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {offer.description}
                            </p>
                        </div>

                        {/* Technical Details */}
                         {offer.technical_details && Object.keys(offer.technical_details).length > 0 && (
                            <div>
                                <h3 className="text-xl font-display mb-4 text-gray-900 dark:text-white">Informações Técnicas</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(offer.technical_details).map(([key, value]) => (
                                        <div key={key} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-sm border border-gray-100 dark:border-gray-800">
                                            <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{key}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Calculator & Features */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <span className="text-xs font-bold tracking-widest uppercase text-[#E60000] mb-2 block">
                                {offer.subtitle}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-display text-gray-900 dark:text-white mb-2">
                                {offer.title}
                            </h1>
                        </div>

                        {/* Calculator Card */}
                        <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-sm shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                                Configurar Oferta
                            </h3>

                            <div className="space-y-6">
                                {/* Duration */}
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                                        <Calendar size={14} /> Duração (meses)
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {durations.map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setDuration(d)}
                                                className={`py-2 px-3 text-sm font-medium rounded-sm border transition-all ${
                                                    duration === d
                                                        ? 'border-[#E60000] bg-red-50 dark:bg-red-900/10 text-[#E60000]'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                                }`}
                                            >
                                                {d} meses
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Mileage */}
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                                        <Gauge size={14} /> Km incluídos (ano)
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {mileages.map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setMileage(m)}
                                                className={`py-2 px-3 text-sm font-medium rounded-sm border transition-all ${
                                                    mileage === m
                                                        ? 'border-[#E60000] bg-red-50 dark:bg-red-900/10 text-[#E60000]'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                                }`}
                                            >
                                                {formatKm(m)} km
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Upfront */}
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                                        <Euro size={14} /> Entrada Inicial
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {upfronts.map(u => (
                                            <button
                                                key={u}
                                                onClick={() => setUpfront(u)}
                                                className={`py-2 px-3 text-sm font-medium rounded-sm border transition-all ${
                                                    upfront === u
                                                        ? 'border-[#E60000] bg-red-50 dark:bg-red-900/10 text-[#E60000]'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                                }`}
                                            >
                                                {u === 0 ? '0 €' : `${formatPrice(u)}€`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Display */}
                                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-end justify-between mb-2">
                                        <span className="text-sm text-gray-500">Mensalidade</span>
                                        <div className="text-right">
                                            {price ? (
                                                <>
                                                    <span className="text-4xl font-bold text-[#E60000] block leading-none">
                                                        {formatPrice(price)}€
                                                    </span>
                                                    <span className="text-xs text-gray-400 mt-1 block">
                                                        IVA Incluído
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Combinação indisponível</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <a
                                    href={`https://wa.me/351919190993?text=${whatsappText}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-primary py-4 text-sm font-bold tracking-wider uppercase text-center block"
                                >
                                    Solicitar Proposta
                                </a>

                                <div className="flex justify-center gap-4 pt-2">
                                    <a href="tel:+351919190993" className="text-sm text-gray-500 hover:text-[#E60000] flex items-center gap-1">
                                        <Phone size={14} /> 919 190 993
                                    </a>
                                    <a href="mailto:daniel.henriques@rodda.pt" className="text-sm text-gray-500 hover:text-[#E60000] flex items-center gap-1">
                                        <Mail size={14} /> Email
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Services Included */}
                        {offer.features && offer.features.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-sm">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Serviços Incluídos</h3>
                                <ul className="space-y-3">
                                    {offer.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="mt-0.5 min-w-[16px] text-[#E60000]">
                                                <Check size={16} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
