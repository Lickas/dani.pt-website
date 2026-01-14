import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { getAuthHeaders } = useAuth();
    
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        whatsapp: '',
        about_text: '',
        google_maps_embed: '',
        schedule: {
            segunda: { open: '09:00', close: '19:00' },
            terca: { open: '09:00', close: '19:00' },
            quarta: { open: '09:00', close: '19:00' },
            quinta: { open: '09:00', close: '19:00' },
            sexta: { open: '09:00', close: '19:00' },
            sabado: { open: '09:00', close: '13:00' },
            domingo: { open: '', close: '' }
        }
    });

    const days = [
        { key: 'segunda', label: 'Segunda-feira' },
        { key: 'terca', label: 'Terça-feira' },
        { key: 'quarta', label: 'Quarta-feira' },
        { key: 'quinta', label: 'Quinta-feira' },
        { key: 'sexta', label: 'Sexta-feira' },
        { key: 'sabado', label: 'Sábado' },
        { key: 'domingo', label: 'Domingo' }
    ];

    useEffect(() => {
        fetchBusinessInfo();
    }, []);

    const fetchBusinessInfo = async () => {
        try {
            const response = await axios.get(`${API_URL}/business-info`);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching business info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleScheduleChange = (day, type, value) => {
        setFormData(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    [type]: value
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await axios.put(`${API_URL}/business-info`, formData, {
                headers: getAuthHeaders()
            });
            toast.success('Configurações guardadas com sucesso');
        } catch (error) {
            toast.error('Erro ao guardar configurações');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-[#F4F4F4] rounded animate-pulse" />
                <div className="h-96 bg-[#F4F4F4] rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-archivo font-black text-2xl md:text-3xl text-[#1A1A1A]">
                    Configurações
                </h1>
                <p className="text-[#666666] mt-1">
                    Gerir informações de contacto e horários
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="settings-form">
                {/* Contact Info */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Informações de Contacto
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Telefone
                            </label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="rounded-[2px]"
                                placeholder="+351 XXX XXX XXX"
                                data-testid="input-phone"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                WhatsApp
                            </label>
                            <Input
                                value={formData.whatsapp}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                className="rounded-[2px]"
                                placeholder="+351XXXXXXXXX"
                                data-testid="input-whatsapp"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="rounded-[2px]"
                                placeholder="email@exemplo.pt"
                                data-testid="input-email"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Morada
                            </label>
                            <Input
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="rounded-[2px]"
                                placeholder="Rua, Cidade, Código Postal"
                                data-testid="input-address"
                            />
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Horário de Funcionamento
                    </h2>
                    <div className="space-y-3">
                        {days.map((day) => (
                            <div key={day.key} className="grid grid-cols-3 gap-4 items-center">
                                <span className="text-sm text-[#666666]">{day.label}</span>
                                <Input
                                    type="time"
                                    value={formData.schedule[day.key]?.open || ''}
                                    onChange={(e) => handleScheduleChange(day.key, 'open', e.target.value)}
                                    className="rounded-[2px]"
                                    placeholder="Abertura"
                                    data-testid={`input-${day.key}-open`}
                                />
                                <Input
                                    type="time"
                                    value={formData.schedule[day.key]?.close || ''}
                                    onChange={(e) => handleScheduleChange(day.key, 'close', e.target.value)}
                                    className="rounded-[2px]"
                                    placeholder="Fecho"
                                    data-testid={`input-${day.key}-close`}
                                />
                            </div>
                        ))}
                        <p className="text-xs text-[#999999] mt-2">
                            Deixe em branco para dias fechados
                        </p>
                    </div>
                </div>

                {/* About */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Sobre o Stand
                    </h2>
                    <Textarea
                        value={formData.about_text}
                        onChange={(e) => handleChange('about_text', e.target.value)}
                        rows={5}
                        className="rounded-[2px] resize-none"
                        placeholder="Texto sobre o stand que aparece na página 'Sobre Nós'..."
                        data-testid="input-about"
                    />
                </div>

                {/* Maps */}
                <div className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <h2 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                        Google Maps
                    </h2>
                    <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                        URL do Embed
                    </label>
                    <Input
                        value={formData.google_maps_embed}
                        onChange={(e) => handleChange('google_maps_embed', e.target.value)}
                        className="rounded-[2px]"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        data-testid="input-maps"
                    />
                    <p className="text-xs text-[#999999] mt-2">
                        Cole aqui o URL de embed do Google Maps para mostrar o mapa na página de contactos
                    </p>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={saving}
                    className="bg-[#E60000] hover:bg-[#CC0000] rounded-[2px]"
                    data-testid="submit-settings"
                >
                    <Save size={16} className="mr-2" />
                    {saving ? 'A guardar...' : 'Guardar Configurações'}
                </Button>
            </form>
        </div>
    );
};
