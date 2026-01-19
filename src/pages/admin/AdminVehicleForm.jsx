/**
 * Admin Vehicle Form - Create/Edit - Supabase Direct
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { vehiclesAPI, uploadAPI } from '../../utils/apiService';

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

    useEffect(() => {
        if (isEditing) {
            fetchVehicle();
        }
    }, [id]);

    const fetchVehicle = async () => {
        try {
            const data = await vehiclesAPI.getById(id);
            setFormData(data);
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
                features: [...(prev.features || []), newFeature.trim()]
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
                const result = await uploadAPI.uploadVehicleImage(file);
                uploadedUrls.push(result.url);
            }

            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...uploadedUrls]
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
                mileage: parseInt(formData.mileage) || 0
            };

            if (isEditing) {
                await vehiclesAPI.update(id, payload);
                toast.success('Viatura atualizada');
            } else {
                await vehiclesAPI.create(payload);
                toast.success('Viatura criada');
            }
            navigate('/admin/viaturas');
        } catch (error) {
            toast.error('Erro ao guardar viatura');
        } finally {
            setLoading(false);
        }
    };

    const brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Peugeot', 'Toyota', 'Renault', 'Tesla', 'Ford', 'Volvo', 'Opel', 'Fiat', 'Citroen', 'Seat', 'Skoda', 'Hyundai', 'Kia', 'Nissan', 'Honda', 'Mazda'];
    const fuelTypes = ['Gasolina', 'Diesel', 'Híbrido', 'Elétrico'];
    const transmissions = ['Manual', 'Automático'];
    const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="max-w-4xl">
            <header className="mb-8">
                <button
                    onClick={() => navigate('/admin/viaturas')}
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar às Viaturas
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white">
                    {isEditing ? 'Editar Viatura' : 'Nova Viatura'}
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Informação Básica</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Marca *</label>
                            <select
                                value={formData.brand}
                                onChange={(e) => handleChange('brand', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            >
                                <option value="">Selecionar marca</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Modelo *</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="Ex: Serie 3 320d"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Ano *</label>
                            <select
                                value={formData.year}
                                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Preço (€) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="Ex: 25000"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Especificações</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Combustível</label>
                            <select
                                value={formData.fuel_type}
                                onChange={(e) => handleChange('fuel_type', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            >
                                {fuelTypes.map((fuel) => (
                                    <option key={fuel} value={fuel}>{fuel}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Quilómetros *</label>
                            <input
                                type="number"
                                value={formData.mileage}
                                onChange={(e) => handleChange('mileage', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="Ex: 50000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Transmissão</label>
                            <select
                                value={formData.transmission}
                                onChange={(e) => handleChange('transmission', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            >
                                {transmissions.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Cor</label>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="Ex: Preto"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Potência</label>
                            <input
                                type="text"
                                value={formData.power}
                                onChange={(e) => handleChange('power', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="Ex: 150cv"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Descrição</h2>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555] resize-none"
                        placeholder="Descrição detalhada da viatura..."
                    />
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Equipamento</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            className="flex-1 px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            placeholder="Adicionar equipamento..."
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="px-4 py-3 border border-[#E5E5E5] dark:border-[#333] text-[#666] dark:text-gray-400 rounded-[2px] hover:bg-[#F4F4F4] dark:hover:bg-[#333] transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(formData.features || []).map((feature, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F4F4F4] dark:bg-[#333] text-[#1A1A1A] dark:text-white rounded-[2px] text-sm">
                                {feature}
                                <button type="button" onClick={() => handleRemoveFeature(index)} className="text-[#999999] hover:text-[#E60000]">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Imagens</h2>
                    <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-[#E5E5E5] dark:border-[#333] rounded-[4px] cursor-pointer hover:border-[#1A1A1A] dark:hover:border-[#555] transition-colors mb-4">
                        {uploading ? <Loader2 size={24} className="text-[#999999] animate-spin" /> : <Upload size={24} className="text-[#999999]" />}
                        <span className="text-[#666666] dark:text-gray-400">
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
                    {(formData.images || []).length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((url, index) => (
                                <div key={index} className="relative aspect-[4/3] bg-[#F4F4F4] dark:bg-[#333] rounded-[2px] overflow-hidden">
                                    <img src={url} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover" />
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

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Estado</h2>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <span className="font-medium text-[#1A1A1A] dark:text-white">Destaque</span>
                                <p className="text-sm text-[#666666] dark:text-gray-400">Mostrar na homepage</p>
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
                                <span className="font-medium text-[#1A1A1A] dark:text-white">Vendido</span>
                                <p className="text-sm text-[#666666] dark:text-gray-400">Marcar como vendida</p>
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

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/viaturas')}
                        className="px-6 py-3 border border-[#E5E5E5] dark:border-[#333] rounded-[2px] text-[#666666] dark:text-gray-400 hover:border-[#1A1A1A] dark:hover:border-[#555] transition-colors"
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
