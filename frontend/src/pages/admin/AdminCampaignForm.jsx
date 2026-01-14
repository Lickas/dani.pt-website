import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminCampaignForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getAuthHeaders } = useAuth();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount_percentage: '',
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        is_active: true,
        vehicle_ids: []
    });

    useEffect(() => {
        if (isEditing) {
            fetchCampaign();
        }
    }, [id]);

    const fetchCampaign = async () => {
        try {
            const response = await axios.get(`${API_URL}/campaigns/all`, {
                headers: getAuthHeaders()
            });
            const campaign = response.data.find(c => c.id === id);
            if (campaign) {
                setFormData({
                    ...campaign,
                    start_date: new Date(campaign.start_date),
                    end_date: new Date(campaign.end_date)
                });
            }
        } catch (error) {
            toast.error('Erro ao carregar campanha');
            navigate('/admin/campanhas');
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
                start_date: formData.start_date.toISOString(),
                end_date: formData.end_date.toISOString()
            };

            if (isEditing) {
                await axios.put(`${API_URL}/campaigns/${id}`, payload, {
                    headers: getAuthHeaders()
                });
                toast.success('Campanha atualizada com sucesso');
            } else {
                await axios.post(`${API_URL}/campaigns`, payload, {
                    headers: getAuthHeaders()
                });
                toast.success('Campanha criada com sucesso');
            }
            navigate('/admin/campanhas');
        } catch (error) {
            toast.error('Erro ao guardar campanha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/admin/campanhas')}
                    className="flex items-center gap-2 text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar às Campanhas
                </button>
                <h1 className="font-archivo font-black text-2xl md:text-3xl text-[#1A1A1A]">
                    {isEditing ? 'Editar Campanha' : 'Nova Campanha'}
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="campaign-form">
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                            Título *
                        </label>
                        <Input
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                            className="rounded-[2px]"
                            placeholder="Ex: Promoção de Verão"
                            data-testid="input-title"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                            Descrição *
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            required
                            rows={3}
                            className="rounded-[2px] resize-none"
                            placeholder="Descrição da campanha..."
                            data-testid="input-description"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                            Percentagem de Desconto
                        </label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount_percentage}
                            onChange={(e) => handleChange('discount_percentage', e.target.value)}
                            className="rounded-[2px]"
                            placeholder="Ex: 10"
                            data-testid="input-discount"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Data de Início
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal rounded-[2px]"
                                        data-testid="input-start-date"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.start_date ? format(formData.start_date, 'PPP', { locale: pt }) : 'Selecionar'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.start_date}
                                        onSelect={(date) => handleChange('start_date', date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Data de Fim
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal rounded-[2px]"
                                        data-testid="input-end-date"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.end_date ? format(formData.end_date, 'PPP', { locale: pt }) : 'Selecionar'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={formData.end_date}
                                        onSelect={(date) => handleChange('end_date', date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <span className="font-medium text-[#1A1A1A]">Campanha Ativa</span>
                            <p className="text-sm text-[#666666]">Mostrar esta campanha no site</p>
                        </div>
                        <Switch
                            checked={formData.is_active}
                            onCheckedChange={(checked) => handleChange('is_active', checked)}
                            data-testid="switch-active"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/admin/campanhas')}
                        className="rounded-[2px]"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#E60000] hover:bg-[#CC0000] rounded-[2px]"
                        data-testid="submit-campaign"
                    >
                        {loading ? 'A guardar...' : isEditing ? 'Guardar Alterações' : 'Criar Campanha'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
