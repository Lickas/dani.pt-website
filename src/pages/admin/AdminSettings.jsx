/**
 * Admin Settings - Business Info & Schedule
 * 
 * TODO: Adicionar upload de logo
 * TODO: Integrar com Google My Business
 * TODO: Adicionar gestão de feriados
 * TODO: Suporte para múltiplas localizações
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || '';
const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';

export const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        phone: '+351 919 190 993',
        email: 'daniel.henriques@dani.pt',
        address: 'Rua da Casa Meada 12, Antanhol, 3040-584 Coimbra',
        whatsapp: '+351919190993',
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

    const getAuthHeaders = () => {
        const token = localStorage.getItem('dani_admin_token');
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchBusinessInfo();
    }, []);

    const fetchBusinessInfo = async () => {
        try {
            const response = await axios.get(`${API_URL}/business-info`);
            if (response.data) {
                setFormData(prev => ({ ...prev, ...response.data }));
            }
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
            toast.success('Configurações guardadas');
        } catch (error) {
            toast.error('Erro ao guardar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-96 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            {/* Header */}
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                    Configurações
                </h1>
                <p className="text-[#666666] mt-1">
                    Informações de contacto e horários do stand
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Phone size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A]">
                            Contactos
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="+351 XXX XXX XXX"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                WhatsApp
                            </label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="+351XXXXXXXXX"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="email@dani.pt"
                            />
                        </div>
                    </div>
                </section>

                {/* Address */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A]">
                            Localização
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                Morada
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="Rua, Cidade, Código Postal"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                URL do Google Maps Embed
                            </label>
                            <input
                                type="url"
                                value={formData.google_maps_embed}
                                onChange={(e) => handleChange('google_maps_embed', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                placeholder="https://www.google.com/maps/embed?pb=..."
                            />
                            <p className="text-xs text-[#999999] mt-1">
                                Cole o URL do iframe do Google Maps
                            </p>
                        </div>
                    </div>
                </section>

                {/* Schedule */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A]">
                            Horário de Funcionamento
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {days.map((day) => (
                            <div key={day.key} className="grid grid-cols-3 gap-4 items-center">
                                <span className="text-sm text-[#666666]">{day.label}</span>
                                <input
                                    type="time"
                                    value={formData.schedule[day.key]?.open || ''}
                                    onChange={(e) => handleScheduleChange(day.key, 'open', e.target.value)}
                                    className="px-4 py-2 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                />
                                <input
                                    type="time"
                                    value={formData.schedule[day.key]?.close || ''}
                                    onChange={(e) => handleScheduleChange(day.key, 'close', e.target.value)}
                                    className="px-4 py-2 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A]"
                                />
                            </div>
                        ))}
                        <p className="text-xs text-[#999999] mt-2">
                            Deixe em branco para dias fechados
                        </p>
                    </div>
                </section>

                {/* About Text */}
                <section className="bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A]">
                            Sobre o Stand
                        </h2>
                    </div>
                    <textarea
                        value={formData.about_text}
                        onChange={(e) => handleChange('about_text', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-[#E5E5E5] rounded-[2px] focus:outline-none focus:border-[#1A1A1A] resize-none"
                        placeholder="Texto que aparece na página 'Sobre Nós'..."
                    />
                </section>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-[#999999] text-white rounded-[2px] font-semibold transition-colors"
                >
                    <Save size={18} />
                    {saving ? 'A guardar...' : 'Guardar Configurações'}
                </button>
            </form>
        </div>
    );
};
