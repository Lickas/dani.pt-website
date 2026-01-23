import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react'; // Adicionado Upload, X, Loader2
import { toast } from 'sonner';
import { campaignsAPI, vehiclesAPI, uploadAPI } from '../../utils/apiService'; // Adicionado uploadAPI

export const AdminCampaignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false); // Novo estado
    const [vehicles, setVehicles] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        campaign_type: 'discount_fixed',
        discount_percentage: '',
        discount_value: '',
        benefit_description: '',
        start_date: '',
        end_date: '',
        is_active: true,
        vehicle_ids: [],
        terms_conditions: '',
        image: '' // Novo campo de imagem
    });

    useEffect(() => {
        fetchVehicles();
        if (isEditing) {
            fetchCampaign();
        }
    }, [id]);

    const fetchVehicles = async () => {
        try {
            const data = await vehiclesAPI.getAll();
            setVehicles(data);
        } catch (error) {
            console.error('Erro ao carregar viaturas:', error);
        }
    };

    const fetchCampaign = async () => {
        try {
            const data = await campaignsAPI.getById(id);
            setFormData({
                ...data,
                // Garantir datas compatíveis com input date
                start_date: data.start_date ? data.start_date.split('T')[0] : '',
                end_date: data.end_date ? data.end_date.split('T')[0] : '',
                vehicle_ids: data.vehicle_ids || []
            });
        } catch (error) {
            toast.error('Erro ao carregar campanha');
            navigate('/admin/campanhas');
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleVehicleToggle = (vehicleId) => {
        setFormData(prev => {
            const currentIds = prev.vehicle_ids || [];
            if (currentIds.includes(vehicleId)) {
                return { ...prev, vehicle_ids: currentIds.filter(id => id !== vehicleId) };
            } else {
                return { ...prev, vehicle_ids: [...currentIds, vehicleId] };
            }
        });
    };

    // Nova função de Upload (Para 1 Imagem - Banner)
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadAPI.uploadCampaignImage(file);
            setFormData(prev => ({ ...prev, image: result.url }));
            toast.success('Imagem carregada');
        } catch (error) {
            console.error(error);
            toast.error(`Erro no upload: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
                discount_value: formData.discount_value ? parseFloat(formData.discount_value) : null,
                start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
                end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
            };

            // Remover ID na criação para evitar erro do Supabase
            if (!isEditing) {
                delete payload.id;
                delete payload.created_at;
            }

            if (isEditing) {
                await campaignsAPI.update(id, payload);
                toast.success('Campanha atualizada');
            } else {
                await campaignsAPI.create(payload);
                toast.success('Campanha criada');
            }
            navigate('/admin/campanhas');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao guardar campanha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <header className="mb-8">
                <button
                    onClick={() => navigate('/admin/campanhas')}
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar às Campanhas
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white">
                    {isEditing ? 'Editar Campanha' : 'Nova Campanha'}
                </h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECÇÃO DE IMAGEM (BANNER) */}
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Imagem de Capa</h2>
                    
                    {formData.image ? (
                        <div className="relative w-full h-48 md:h-64 bg-gray-100 rounded-[2px] overflow-hidden group">
                            <img src={formData.image} alt="Capa da campanha" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="bg-white text-[#E60000] px-4 py-2 rounded-[2px] font-medium flex items-center gap-2"
                                >
                                    <X size={18} /> Remover Imagem
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center gap-2 h-48 border-2 border-dashed border-[#E5E5E5] dark:border-[#333] rounded-[4px] cursor-pointer hover:border-[#1A1A1A] dark:hover:border-[#555] transition-colors bg-[#FAFAFA] dark:bg-[#222]">
                            {uploading ? (
                                <Loader2 size={32} className="text-[#E60000] animate-spin" />
                            ) : (
                                <Upload size={32} className="text-[#999999]" />
                            )}
                            <span className="text-[#666666] dark:text-gray-400 font-medium">
                                {uploading ? 'A carregar...' : 'Carregar imagem de capa'}
                            </span>
                            <span className="text-xs text-[#999999]">PNG, JPG ou WEBP</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                    )}
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Detalhes da Campanha</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Título *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="Ex: Black Friday 2024"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Descrição</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555] resize-none"
                                placeholder="Resumo da campanha..."
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Termos e Condições</label>
                            <textarea
                                value={formData.terms_conditions}
                                onChange={(e) => handleChange('terms_conditions', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555] resize-none"
                                placeholder="Regras da campanha..."
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Configuração do Desconto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Tipo de Campanha</label>
                            <select
                                value={formData.campaign_type}
                                onChange={(e) => handleChange('campaign_type', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            >
                                <option value="discount_fixed">Desconto Fixo (€)</option>
                                <option value="discount_percent">Desconto Percentual (%)</option>
                                <option value="offer">Oferta (Sem desconto monetário)</option>
                            </select>
                        </div>
                        
                        {formData.campaign_type === 'discount_fixed' && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Valor do Desconto (€)</label>
                                <input
                                    type="number"
                                    value={formData.discount_value}
                                    onChange={(e) => handleChange('discount_value', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                    placeholder="Ex: 500"
                                />
                            </div>
                        )}

                        {formData.campaign_type === 'discount_percent' && (
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Percentagem (%)</label>
                                <input
                                    type="number"
                                    value={formData.discount_percentage}
                                    onChange={(e) => handleChange('discount_percentage', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                    placeholder="Ex: 10"
                                />
                            </div>
                        )}

                        {formData.campaign_type === 'offer' && (
                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Descrição da Oferta</label>
                                <input
                                    type="text"
                                    value={formData.benefit_description}
                                    onChange={(e) => handleChange('benefit_description', e.target.value)}
                                    className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                    placeholder="Ex: Oferta de Depósito Cheio"
                                />
                            </div>
                        )}
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Datas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Data de Início</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => handleChange('start_date', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Data de Fim</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => handleChange('end_date', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                            />
                        </div>
                         <div className="md:col-span-2 flex items-center gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => handleChange('is_active', e.target.checked)}
                                    className="w-5 h-5 rounded border-[#E5E5E5] text-[#E60000] focus:ring-[#E60000]"
                                />
                                <span className="text-[#1A1A1A] dark:text-white font-medium">Campanha Ativa</span>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white mb-4">Associar Viaturas</h2>
                    <p className="text-sm text-[#666666] mb-4">Selecione as viaturas onde esta campanha se aplica.</p>
                    
                    <div className="max-h-60 overflow-y-auto space-y-2 border border-[#E5E5E5] dark:border-[#333] rounded-[2px] p-2">
                        {vehicles.map((vehicle) => (
                            <label key={vehicle.id} className="flex items-center gap-3 p-2 hover:bg-[#F9F9F9] dark:hover:bg-[#222] cursor-pointer rounded">
                                <input
                                    type="checkbox"
                                    checked={(formData.vehicle_ids || []).includes(vehicle.id)}
                                    onChange={() => handleVehicleToggle(vehicle.id)}
                                    className="w-4 h-4 rounded border-[#E5E5E5] text-[#E60000] focus:ring-[#E60000]"
                                />
                                <div>
                                    <span className="block font-medium text-[#1A1A1A] dark:text-white">{vehicle.brand} {vehicle.model}</span>
                                    <span className="text-xs text-[#999999]">{vehicle.year} • {vehicle.fuel_type}</span>
                                </div>
                            </label>
                        ))}
                        {vehicles.length === 0 && (
                            <p className="text-center text-[#999999] py-4">Nenhuma viatura disponível.</p>
                        )}
                    </div>
                </section>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/campanhas')}
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
                        {loading ? 'A guardar...' : isEditing ? 'Guardar Alterações' : 'Criar Campanha'}
                    </button>
                </div>
            </form>
        </div>
    );
};
