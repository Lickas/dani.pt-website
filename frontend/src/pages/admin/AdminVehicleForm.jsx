/**
 * Admin Vehicle Form - Create/Edit
 * 
 * TODO: Implementar drag & drop para reordenar imagens
 * TODO: Adicionar preview de galeria
 * TODO: Validação mais robusta com Zod
 * TODO: Auto-save draft
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, X, Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || '';
const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';

export const AdminVehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        fuel_type: 'Gasolina',
        mileage: '',
        transmission: 'Manual',
        color: '',
        power: '',
        description: '',
        features: [],
        images: [],
        is_featured: false,
        is_sold: false
    });
    const [newFeature, setNewFeature] = useState('');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('dani_admin_token');
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        if (isEditing) {
            fetchVehicle();
        }
    }, [id]);

    const fetchVehicle = async () => {
        try {
            const response = await axios.get(`${API_URL}/vehicles/${id}`);
            setFormData(response.data);
        } catch (error) {
            toast.error('Erro ao carregar viatura');
            navigate('/admin/viaturas');
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of files) {
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const response = await axios.post(`${API_URL}/upload`, formDataUpload, {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadedUrls.push(`${BASE_URL}${response.data.url}`);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
            toast.success('Imagens carregadas');
        } catch (error) {
            toast.error('Erro ao carregar imagens');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year),
                price: parseFloat(formData.price),
                mileage: parseInt(formData.mileage)
            };

            if (isEditing) {
                await axios.put(`${API_URL}/vehicles/${id}`, payload, {
                    headers: getAuthHeaders()
                });
                toast.success('Viatura atualizada');
            } else {
                await axios.post(`${API_URL}/vehicles`, payload, {
                    headers: getAuthHeaders()
                });
                toast.success('Viatura criada');
            }
            navigate('/admin/viaturas');
        } catch (error) {
            toast.error('Erro ao guardar viatura');
        } finally {
            setLoading(false);
        }
    };

    // Options
    const brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Peugeot', 'Toyota', 'Renault', 'Tesla', 'Ford', 'Volvo', 'Opel', 'Fiat', 'Citroen', 'Seat', 'Skoda', 'Hyundai', 'Kia', 'Nissan', 'Honda', 'Mazda'];
    const fuelTypes = ['Gasolina', 'Diesel', 'Híbrido', 'Elétrico'];
    const transmissions = ['Manual', 'Automático'];
    const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <header className="mb-8">
                <button
                    onClick={() => navigate('/admin/viaturas')}
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar às Viaturas
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                    {isEditing ? 'Editar Viatura' : 'Nova Viatura'}
                </h1>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Informação Básica
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Marca *
                            </label>
                            <select
                                value={formData.brand}
                                onChange={(e) => handleChange('brand', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                            >
                                <option value="">Selecionar marca</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Modelo *
                            </label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="Ex: Serie 3 320d"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Ano *
                            </label>
                            <select
                                value={formData.year}
                                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Preço (€) *
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="Ex: 25000"
                            />
                        </div>
                    </div>
                </section>

                {/* Specs */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Especificações
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Combustível
                            </label>
                            <select
                                value={formData.fuel_type}
                                onChange={(e) => handleChange('fuel_type', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                            >
                                {fuelTypes.map((fuel) => (
                                    <option key={fuel} value={fuel}>{fuel}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Quilómetros *
                            </label>
                            <input
                                type="number"
                                value={formData.mileage}
                                onChange={(e) => handleChange('mileage', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="Ex: 50000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Transmissão
                            </label>
                            <select
                                value={formData.transmission}
                                onChange={(e) => handleChange('transmission', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                            >
                                {transmissions.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Cor
                            </label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="Ex: Preto"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Potência
                            </label>
                            <input
                                type="text"
                                value={formData.power}
                                onChange={(e) => handleChange('power', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="Ex: 150cv"
                            />
                        </div>
                    </div>
                </section>

                {/* Description */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Descrição
                    </h2>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A] resize-none"
                        placeholder="Descrição detalhada da viatura..."
                    />
                </section>

                {/* Features */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Equipamento
                    </h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            className="flex-1 px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                            placeholder="Adicionar equipamento..."
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="px-4 py-3 border border-[#E5E5E5] rounded-[2px] hover:bg-[#F4F4F4] transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-[#F4F4F4] rounded-[2px] text-sm"
                            >
                                {feature}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="text-[#999999] hover:text-[#E60000]"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Images */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Imagens
                    </h2>
                    <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-[#E5E5E5] rounded-[4px] cursor-pointer hover:border-[#1A1A1A] transition-colors mb-4">
                        <Upload size={24} className="text-[#999999]" />
                        <span className="text-[#666666]">
                            {uploading ? 'A carregar...' : 'Clique para carregar imagens'}
                        </span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((url, index) => (
                                <div key={index} className="relative aspect-[4/3] bg-[#F4F4F4] rounded-[2px] overflow-hidden">
                                    <img
                                        src={url}
                                        alt={`Imagem ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                                    >
                                        <X size={14} className="text-[#E60000]" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Status */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] mb-4">
                        Estado
                    </h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <span className="font-medium text-[#1A1A1A]">Destaque</span>
                                <p className="text-sm text-[#666666]">Mostrar na homepage</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.is_featured}
                                onChange={(e) => handleChange('is_featured', e.target.checked)}
                                className="w-5 h-5 rounded border-[#E5E5E5] text-[#E60000] focus:ring-[#E60000]"
                            />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <span className="font-medium text-[#1A1A1A]">Vendido</span>
                                <p className="text-sm text-[#666666]">Marcar como vendida</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.is_sold}
                                onChange={(e) => handleChange('is_sold', e.target.checked)}
                                className="w-5 h-5 rounded border-[#E5E5E5] text-[#E60000] focus:ring-[#E60000]"
                            />
                        </label>
                    </div>
                </section>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/viaturas')}
                        className="px-6 py-3 border border-[#E5E5E5] rounded-[2px] text-[#666666] hover:border-[#1A1A1A] transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-[#999999] text-white rounded-[2px] font-semibold transition-colors"
                    >
                        <Save size={18} />
                        {loading ? 'A guardar...' : isEditing ? 'Guardar Alterações' : 'Criar Viatura'}
                    </button>
                </div>
            </form>
        </div>
    );
};
