import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { contactsAPI } from '../utils/apiService';
import emailjs from '@emailjs/browser';
import { supabase } from '../supabaseClient'; // Importar o cliente Supabase

export const Contact = () => {
    // 1. Estado para o Formulário
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    // 2. Estado para as Informações do Stand (Vêm da BD)
    const [info, setInfo] = useState({
        phone: '+351 919 190 993', // Valores padrão/fallback enquanto carrega
        email: 'daniel.henriques@dani.pt',
        address: 'Rua da Casa Meada 12, Antanhol, 3040-584 Coimbra',
        whatsapp: '+351919190993',
        google_maps_embed: '',
        schedule: null
    });

    // 3. Buscar dados ao Supabase ao carregar a página
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
                // Se o schedule vier como string JSON, fazemos o parse
                let safeSchedule = data.schedule;
                if (typeof safeSchedule === 'string') {
                    try { safeSchedule = JSON.parse(safeSchedule); } catch (e) { }
                }
                
                setInfo({
                    ...data,
                    schedule: safeSchedule
                });
            }
        } catch (error) {
            console.error('Erro ao carregar informações:', error);
        }
    };

    // Auxiliar para limpar numero whatsapp (remover espaços e +)
    const cleanPhoneForLink = (phone) => {
        if (!phone) return '';
        return phone.replace(/[^0-9]/g, '');
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const serviceId = "service_broc3lo";   
        const templateId = "template_76j3pz8"; 
        const publicKey = "INbSKmzMapekzuclK";   

        try {
            await contactsAPI.create(formData);

            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                message: formData.message,
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            toast.success('Mensagem enviada! Responderemos brevemente.');
            setFormData({ name: '', email: '', phone: '', message: '' });

        } catch (error) {
            console.error('Erro no envio:', error);
            toast.error('Erro ao enviar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Ordem dos dias para renderizar o horário
    const daysOrder = [
        { key: 'segunda', label: 'Segunda' },
        { key: 'terca', label: 'Terça' },
        { key: 'quarta', label: 'Quarta' },
        { key: 'quinta', label: 'Quinta' },
        { key: 'sexta', label: 'Sexta' },
        { key: 'sabado', label: 'Sábado' },
        { key: 'domingo', label: 'Domingo' }
    ];

    return (
        <main className="pt-20">
            {/* HEADER */}
            <section className="bg-[#FAFAFA] py-16 md:py-24">
                <div className="container-site">
                    <div className="flex items-start gap-6">
                        <div className="w-[2px] h-20 bg-[#E60000] hidden md:block"></div>
                        <div>
                            <span className="label-style text-[#999]">Contacto</span>
                            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-[#1A1A1A] mt-2">
                                Fale<br />comigo
                            </h1>
                            <p className="dani-quote mt-4">
                                Perguntas diretas. Respostas diretas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-16 md:py-24">
                <div className="container-site">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        
                        {/* LEFT - Contact Info (Agora Dinâmico) */}
                        <div className="lg:col-span-5">
                            <div className="space-y-8">
                                
                                {/* Telefone Dinâmico */}
                                <div>
                                    <span className="label-style text-[#999] flex items-center gap-2">
                                        <Phone size={14} /> Telefone
                                    </span>
                                    <a 
                                        href={`tel:${info.phone}`}
                                        className="block text-2xl font-semibold text-[#1A1A1A] mt-2 hover:text-[#E60000] transition-colors"
                                    >
                                        {info.phone}
                                    </a>
                                </div>

                                {/* Email Dinâmico */}
                                <div>
                                    <span className="label-style text-[#999] flex items-center gap-2">
                                        <Mail size={14} /> Email
                                    </span>
                                    <a 
                                        href={`mailto:${info.email}`}
                                        className="block text-lg text-[#1A1A1A] mt-2 hover:text-[#E60000] transition-colors"
                                    >
                                        {info.email}
                                    </a>
                                </div>

                                {/* Morada Dinâmica */}
                                <div>
                                    <span className="label-style text-[#999] flex items-center gap-2">
                                        <MapPin size={14} /> Morada
                                    </span>
                                    <p className="text-lg text-[#1A1A1A] mt-2">
                                        {info.address}
                                    </p>
                                </div>

                                {/* Horário Dinâmico */}
                                <div>
                                    <span className="label-style text-[#999] flex items-center gap-2">
                                        <Clock size={14} /> Horário
                                    </span>
                                    <div className="mt-2 space-y-1 text-[#1A1A1A] text-sm">
                                        {info.schedule ? (
                                            daysOrder.map((day) => {
                                                const hours = info.schedule[day.key];
                                                if (!hours) return null;
                                                return (
                                                    <div key={day.key} className="flex justify-between max-w-[250px] border-b border-gray-100 pb-1 mb-1 last:border-0">
                                                        <span className="font-medium text-gray-500">{day.label}</span>
                                                        <span>
                                                            {hours.open && hours.close 
                                                                ? `${hours.open} - ${hours.close}`
                                                                : <span className="text-[#E60000] text-xs font-bold uppercase">Fechado</span>
                                                            }
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p>A carregar horário...</p>
                                        )}
                                    </div>
                                </div>

                                {/* WhatsApp Button Dinâmico */}
                                {info.whatsapp && (
                                    <a
                                        href={`https://wa.me/${cleanPhoneForLink(info.whatsapp)}?text=Olá! Gostava de saber mais informações.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold hover:bg-[#1DA851] transition-colors rounded-[2px]"
                                    >
                                        <MessageCircle size={18} />
                                        WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* RIGHT - Form (Mantido igual) */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#FAFAFA] p-8 md:p-12">
                                <h2 className="font-display text-3xl text-[#1A1A1A] mb-8">
                                    Envie mensagem
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="label-style text-[#999] mb-2 block">Nome</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input-style bg-white"
                                            placeholder="O seu nome"
                                        />
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label-style text-[#999] mb-2 block">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="input-style bg-white"
                                                placeholder="email@exemplo.pt"
                                            />
                                        </div>
                                        <div>
                                            <label className="label-style text-[#999] mb-2 block">Telefone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input-style bg-white"
                                                placeholder="+351 XXX XXX XXX"
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="label-style text-[#999] mb-2 block">Mensagem</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="input-style bg-white resize-none"
                                            placeholder="Como podemos ajudar?"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full"
                                    >
                                        {loading ? 'A enviar...' : (
                                            <>
                                                <Send size={18} />
                                                Enviar mensagem
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAP - Dinâmico */}
            <section className="h-[400px] md:h-[500px] bg-[#F5F5F5]">
                {info.google_maps_embed ? (
                    <iframe
                        src={info.google_maps_embed}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Localização dANI.PT"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <p>Mapa indisponível</p>
                    </div>
                )}
            </section>
        </main>
    );
};
