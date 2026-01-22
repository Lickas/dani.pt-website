/**
 * Admin Settings - Business Info & Schedule - Supabase Direct
 */

import React, { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../supabaseClient';

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
            segunda: { open: '09:00', close: '20:00' },
            terca: { open: '09:00', close: '20:00' },
            quarta: { open: '09:00', close: '20:00' },
            quinta: { open: '09:00', close: '20:00' },
            sexta: { open: '09:00', close: '20:00' },
            sabado: { open: '09:00', close: '20:00' },
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
            const { data, error } = await supabase
                .from('business_info')
                .select('*')
                .single();

            if (data && !error) {
                setFormData(prev => ({ ...prev, ...data }));
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
            const { error } = await supabase
                .from('business_info')
                .upsert([{ id: 1, ...formData }]);

            if (error) throw error;
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
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-6">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white">Configurações</h1>
                <p className="text-[#666666] dark:text-gray-400 mt-1">Informações de contacto e horários do stand</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Phone size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white">Contactos</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Telefone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="+351 XXX XXX XXX"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">WhatsApp</label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="+351XXXXXXXXX"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="email@dani.pt"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white">Localização</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">Morada</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="Rua, Cidade, Código Postal"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">URL do Google Maps Embed</label>
                            <input
                                type="url"
                                value={formData.google_maps_embed}
                                onChange={(e) => handleChange('google_maps_embed', e.target.value)}
                                className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                placeholder="https://www.google.com/maps/embed?pb=..."
                            />
                            <p className="text-xs text-[#999999] mt-1">Cole o URL do iframe do Google Maps</p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white">Horário de Funcionamento</h2>
                    </div>
                    <div className="space-y-3">
                        {days.map((day) => (
                            <div key={day.key} className="grid grid-cols-3 gap-4 items-center">
                                <span className="text-sm text-[#666666] dark:text-gray-400">{day.label}</span>
                                <input
                                    type="time"
                                    value={formData.schedule[day.key]?.open || ''}
                                    onChange={(e) => handleScheduleChange(day.key, 'open', e.target.value)}
                                    className="px-4 py-2 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                />
                                <input
                                    type="time"
                                    value={formData.schedule[day.key]?.close || ''}
                                    onChange={(e) => handleScheduleChange(day.key, 'close', e.target.value)}
                                    className="px-4 py-2 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                                />
                            </div>
                        ))}
                        <p className="text-xs text-[#999999] mt-2">Deixe em branco para dias fechados</p>
                    </div>
                </section>

                <section className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail size={20} className="text-[#E60000]" />
                        <h2 className="font-bold text-lg text-[#1A1A1A] dark:text-white">Sobre o Stand</h2>
                    </div>
                    <textarea
                        value={formData.about_text}
                        onChange={(e) => handleChange('about_text', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#222] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555] resize-none"
                        placeholder="Texto que aparece na página 'Sobre Nós'..."
                    />
                </section>

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
