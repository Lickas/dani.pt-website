import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminVehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAuthHeaders } = useAuth();
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
                uploadedUrls.push(`${process.env.REACT_APP_BACKEND_URL}${response.data.url}`);
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
            toast.success('Imagens carregadas com sucesso');
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
                toast.success('Viatura atualizada com sucesso');
            } else {
                await axios.post(`${API_URL}/vehicles`, payload, {
                    headers: getAuthHeaders()
                });
                toast.success('Viatura criada com sucesso');
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
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/admin/viaturas')}
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar às Viaturas
                </button>
                <h1 className="font-archivo font-black text-2xl md:text-3xl text-[#1A1A1A]">
                    {isEditing ? 'Editar Viatura' : 'Nova Viatura'}
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8" data-testid="vehicle-form">
                {/* Basic Info */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Informação Básica
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Marca *
                            </label>
                            <Select
                                value={formData.brand}
                                onValueChange={(value) => handleChange('brand', value)}
                            >
                                <SelectTrigger className="rounded-[2px]" data-testid="input-brand">
                                    <SelectValue placeholder="Selecionar marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Modelo *
                            </label>
                            <Input
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                required
                                className="rounded-[2px]"
                                placeholder="Ex: Serie 3 320d"
                                data-testid="input-model"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Ano *
                            </label>
                            <Select
                                value={formData.year.toString()}
                                onValueChange={(value) => handleChange('year', parseInt(value))}
                            >
                                <SelectTrigger className="rounded-[2px]" data-testid="input-year">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Preço (€) *
                            </label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                required
                                className="rounded-[2px]"
                                placeholder="Ex: 25000"
                                data-testid="input-price"
                            />
                        </div>
                    </div>
                </div>

                {/* Specs */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Especificações
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Combustível
                            </label>
                            <Select
                                value={formData.fuel_type}
                                onValueChange={(value) => handleChange('fuel_type', value)}
                            >
                                <SelectTrigger className="rounded-[2px]" data-testid="input-fuel">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {fuelTypes.map((fuel) => (
                                        <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Quilómetros *
                            </label>
                            <Input
                                type="number"
                                value={formData.mileage}
                                onChange={(e) => handleChange('mileage', e.target.value)}
                                required
                                className="rounded-[2px]"
                                placeholder="Ex: 50000"
                                data-testid="input-mileage"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Transmissão
                            </label>
                            <Select
                                value={formData.transmission}
                                onValueChange={(value) => handleChange('transmission', value)}
                            >
                                <SelectTrigger className="rounded-[2px]" data-testid="input-transmission">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {transmissions.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Cor
                            </label>
                            <Input
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="rounded-[2px]"
                                placeholder="Ex: Preto"
                                data-testid="input-color"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Potência
                            </label>
                            <Input
                                value={formData.power}
                                onChange={(e) => handleChange('power', e.target.value)}
                                className="rounded-[2px]"
                                placeholder="Ex: 150cv"
                                data-testid="input-power"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Descrição
                    </h2>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="rounded-[2px] resize-none"
                        placeholder="Descrição detalhada da viatura..."
                        data-testid="input-description"
                    />
                </div>

                {/* Features */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Equipamento
                    </h2>
                    <div className="flex gap-2 mb-4">
                        <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            className="rounded-[2px]"
                            placeholder="Adicionar equipamento..."
                            data-testid="input-feature"
                        />
                        <Button
                            type="button"
                            onClick={handleAddFeature}
                            variant="outline"
                            className="rounded-[2px]"
                        >
                            <Plus size={18} />
                        </Button>
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
                </div>

                {/* Images */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Imagens
                    </h2>
                    <div className="mb-4">
                        <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-[#E5E5E5] rounded-[4px] cursor-pointer hover:border-[#1A1A1A] transition-colors">
                            <Upload size={24} className="text-[#999999]" />
                            <span className="text-[#666666]">
                                {uploading ? 'A carregar...' : 'Carregar imagens'}
                            </span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                                data-testid="input-images"
                            />
                        </label>
                    </div>
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
                </div>

                {/* Status */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Estado
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-medium text-[#1A1A1A]">Destaque</span>
                                <p className="text-sm text-[#666666]">Mostrar esta viatura em destaque na homepage</p>
                            </div>
                            <Switch
                                checked={formData.is_featured}
                                onCheckedChange={(checked) => handleChange('is_featured', checked)}
                                data-testid="switch-featured"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-medium text-[#1A1A1A]">Vendido</span>
                                <p className="text-sm text-[#666666]">Marcar esta viatura como vendida</p>
                            </div>
                            <Switch
                                checked={formData.is_sold}
                                onCheckedChange={(checked) => handleChange('is_sold', checked)}
                                data-testid="switch-sold"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/viaturas')}
                        className="rounded-[2px]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#E60000] hover:bg-[#CC0000] rounded-[2px]"
                        data-testid="submit-vehicle"
                    >
                        {loading ? 'A guardar...' : isEditing ? 'Guardar Alterações' : 'Criar Viatura'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
