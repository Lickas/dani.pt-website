import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Save, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { rentingAPI, uploadAPI } from '../../utils/apiService';

export const AdminRentingForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        images: [], // Changed from image_url to images array
        is_active: true,
        category: 'private',
        features: [],
        technical_details: {},
        pricing_matrix: []
    });

    // Ensure technical_details is an object if it comes back as null/undefined
    useEffect(() => {
        if (!formData.technical_details) {
            setFormData(prev => ({ ...prev, technical_details: {} }));
        }
    }, [formData.technical_details]);

    const [newFeature, setNewFeature] = useState('');

    // Technical Details State
    const [techKey, setTechKey] = useState('');
    const [techValue, setTechValue] = useState('');

    // Pricing Matrix State
    const [matrixRow, setMatrixRow] = useState({
        duration: 48,
        mileage: 10000,
        upfront: 0,
        price: 0
    });

    useEffect(() => {
        if (isEditing) {
            fetchOffer();
        }
    }, [id]);

    const fetchOffer = async () => {
        try {
            const data = await rentingAPI.getById(id);
            // Handle migration from old image_url to images array if necessary
            let images = data.images || [];
            if (data.image_url && images.length === 0) {
                images = [data.image_url];
            }

            setFormData({ ...data, images });
        } catch (error) {
            toast.error('Erro ao carregar oferta');
            navigate('/admin/renting');
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Features
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

    // Technical Details
    const handleAddTechDetail = () => {
        if (techKey.trim() && techValue.trim()) {
            setFormData(prev => ({
                ...prev,
                technical_details: {
                    ...(prev.technical_details || {}),
                    [techKey.trim()]: techValue.trim()
                }
            }));
            setTechKey('');
            setTechValue('');
        }
    };

    const handleRemoveTechDetail = (key) => {
        const newDetails = { ...formData.technical_details };
        delete newDetails[key];
        setFormData(prev => ({ ...prev, technical_details: newDetails }));
    };

    // Pricing Matrix
    const handleAddMatrixRow = () => {
        if (matrixRow.price > 0) {
            setFormData(prev => ({
                ...prev,
                pricing_matrix: [...(prev.pricing_matrix || []), { ...matrixRow }]
            }));
            // Reset price but keep others for easier entry
            setMatrixRow(prev => ({ ...prev, price: 0 }));
        } else {
            toast.error('O preço deve ser maior que 0');
        }
    };

    const handleRemoveMatrixRow = (index) => {
        setFormData(prev => ({
            ...prev,
            pricing_matrix: prev.pricing_matrix.filter((_, i) => i !== index)
        }));
    };

    // Image Upload (Multi-file)
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const uploadedUrls = [];

        try {
            for (const file of files) {
                // Reusing vehicle image upload bucket/logic
                const result = await uploadAPI.uploadVehicleImage(file);
                if (result && result.url) {
                    uploadedUrls.push(result.url);
                }
            }

            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...uploadedUrls]
            }));
            toast.success('Imagens carregadas com sucesso');
        } catch (error) {
            console.error('Erro upload:', error);
            toast.error(`Erro no upload: ${error.message || 'Erro desconhecido'}`);
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
            const payload = { ...formData };

            // Ensure images is saved as JSONB array
            if (!payload.images) payload.images = [];

            // Remove legacy field if present in state
            delete payload.image_url;

            if (!isEditing) {
                delete payload.id;
                delete payload.created_at;
            }

            if (isEditing) {
                await rentingAPI.update(id, payload);
                toast.success('Oferta atualizada');
            } else {
                await rentingAPI.create(payload);
                toast.success('Oferta criada');
            }
            navigate('/admin/renting');
        } catch (error) {
            console.error('Erro submit:', error);
            toast.error('Erro ao guardar oferta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <header className="mb-8">
                <button
                    onClick={() => navigate('/admin/renting')}
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white">
                    {isEditing ? 'Editar Oferta Renting' : 'Nova Oferta Renting'}
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Informação Básica</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label-style">Título *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                                className="input-style"
                                placeholder="Ex: Opel Corsa 1.2 GS"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-style">Subtítulo</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => handleChange('subtitle', e.target.value)}
                                className="input-style"
                                placeholder="Ex: Aluguer de longa duração"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label-style">Descrição</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                className="input-style resize-none"
                                placeholder="Descrição detalhada..."
                            />
                        </div>
                        <div>
                            <label className="label-style">Categoria</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="input-style"
                            >
                                <option value="private">Particulares</option>
                                <option value="business">Empresas</option>
                                <option value="both">Ambos</option>
                            </select>
                        </div>
                        <div>
                            <label className="label-style">Estado</label>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => handleChange('is_active', e.target.checked)}
                                    className="w-5 h-5 rounded border-[#E5E5E5] text-[#E60000] focus:ring-[#E60000]"
                                />
                                <span className="text-sm">Oferta Ativa</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Images - Multi-upload similar to VehicleForm */}
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

                {/* Features */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Serviços Incluídos</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            className="input-style"
                            placeholder="Adicionar serviço (ex: Seguro, Manutenção...)"
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="px-4 py-2 border border-[#E5E5E5] dark:border-[#333] rounded-[2px] hover:bg-gray-50 dark:hover:bg-[#333]"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(formData.features || []).map((feature, index) => (
                            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-[#333] rounded-[2px] text-sm">
                                {feature}
                                <button type="button" onClick={() => handleRemoveFeature(index)} className="ml-1 text-gray-400 hover:text-red-500">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Technical Details */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Detalhes Técnicos</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={techKey}
                            onChange={(e) => setTechKey(e.target.value)}
                            className="input-style w-1/3"
                            placeholder="Característica (ex: Motor)"
                        />
                        <input
                            type="text"
                            value={techValue}
                            onChange={(e) => setTechValue(e.target.value)}
                            className="input-style flex-1"
                            placeholder="Valor (ex: 1.2 Turbo)"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechDetail())}
                        />
                        <button
                            type="button"
                            onClick={handleAddTechDetail}
                            className="px-4 py-2 border border-[#E5E5E5] dark:border-[#333] rounded-[2px] hover:bg-gray-50 dark:hover:bg-[#333]"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(formData.technical_details || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#333] rounded-[2px] border border-gray-100 dark:border-gray-700">
                                <div className="text-sm">
                                    <span className="block font-bold text-xs uppercase text-gray-400">{key}</span>
                                    <span>{value}</span>
                                </div>
                                <button type="button" onClick={() => handleRemoveTechDetail(key)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Matrix */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Tabela de Preços</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 items-end">
                        <div>
                            <label className="label-style">Duração (meses)</label>
                            <input
                                type="number"
                                value={matrixRow.duration}
                                onChange={(e) => setMatrixRow(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                className="input-style"
                            />
                        </div>
                        <div>
                            <label className="label-style">Km Total</label>
                            <input
                                type="number"
                                value={matrixRow.mileage}
                                onChange={(e) => setMatrixRow(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                                className="input-style"
                            />
                        </div>
                        <div>
                            <label className="label-style">Entrada (€)</label>
                            <input
                                type="number"
                                value={matrixRow.upfront}
                                onChange={(e) => setMatrixRow(prev => ({ ...prev, upfront: parseInt(e.target.value) || 0 }))}
                                className="input-style"
                            />
                        </div>
                        <div>
                            <label className="label-style">Mensalidade (€)</label>
                            <input
                                type="number"
                                value={matrixRow.price}
                                onChange={(e) => setMatrixRow(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className="input-style"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddMatrixRow}
                            className="h-[42px] bg-[#E60000] text-white rounded-[2px] font-medium hover:bg-[#CC0000]"
                        >
                            Adicionar
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-[#333]">
                                <tr>
                                    <th className="px-4 py-3">Duração</th>
                                    <th className="px-4 py-3">Km Total</th>
                                    <th className="px-4 py-3">Entrada</th>
                                    <th className="px-4 py-3">Mensalidade</th>
                                    <th className="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(formData.pricing_matrix || []).sort((a,b) => a.duration - b.duration).map((row, index) => (
                                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                                        <td className="px-4 py-3">{row.duration} meses</td>
                                        <td className="px-4 py-3">{row.mileage} km</td>
                                        <td className="px-4 py-3">{row.upfront} €</td>
                                        <td className="px-4 py-3 font-bold">{row.price} €</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMatrixRow(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/renting')}
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
                        {loading ? 'A guardar...' : 'Guardar Alterações'}
                    </button>
                </div>
            </form>

            <style>{`
                .input-style {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #E5E5E5;
                    background-color: white;
                    color: #1A1A1A;
                    border-radius: 2px;
                    outline: none;
                }
                .dark .input-style {
                    border-color: #333;
                    background-color: #222;
                    color: white;
                }
                .input-style:focus {
                    border-color: #1A1A1A;
                }
                .dark .input-style:focus {
                    border-color: #555;
                }
                .label-style {
                    display: block;
                    font-size: 0.75rem;
                    font-family: monospace;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #999999;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
};
