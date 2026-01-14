import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${API_URL}/contacts`, formData);
            toast.success('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast.error('Erro ao enviar mensagem. Por favor tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: Phone,
            label: 'Telefone',
            value: '+351 919 190 993',
            href: 'tel:+351919190993'
        },
        {
            icon: Mail,
            label: 'Email',
            value: 'daniel.henriques@dani.pt',
            href: 'mailto:daniel.henriques@dani.pt'
        },
        {
            icon: MapPin,
            label: 'Morada',
            value: 'Rua da Casa Meada 12, Antanhol, 3040-584 Coimbra',
            href: 'https://maps.google.com/?q=Rua+da+Casa+Meada+12+Antanhol+Coimbra'
        }
    ];

    const schedule = [
        { day: 'Segunda - Sexta', hours: '09:00 - 19:00' },
        { day: 'Sábado', hours: '09:00 - 13:00' },
        { day: 'Domingo', hours: 'Fechado' }
    ];

    return (
        <main className="pt-16 md:pt-20 pb-20 md:pb-0">
            {/* Header */}
            <section className="bg-[#F4F4F4] py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                        Contacte-nos
                    </span>
                    <h1 className="font-archivo font-black text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mt-2">
                        Fale connosco
                    </h1>
                    <p className="text-[#666666] mt-4 max-w-lg">
                        Tem alguma questão? Quer agendar uma visita? 
                        Entre em contacto e teremos todo o gosto em ajudar.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                        {/* Contact Form */}
                        <div>
                            <h2 className="font-archivo font-bold text-2xl text-[#1A1A1A] mb-6">
                                Envie-nos uma mensagem
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                        Nome *
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="rounded-[2px] border-[#E5E5E5] focus:border-[#1A1A1A]"
                                        placeholder="O seu nome"
                                        data-testid="contact-name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                            Email *
                                        </label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="rounded-[2px] border-[#E5E5E5] focus:border-[#1A1A1A]"
                                            placeholder="seu@email.pt"
                                            data-testid="contact-email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                            Telefone
                                        </label>
                                        <Input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="rounded-[2px] border-[#E5E5E5] focus:border-[#1A1A1A]"
                                            placeholder="+351 XXX XXX XXX"
                                            data-testid="contact-phone"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-widest text-[#999999] mb-2">
                                        Mensagem *
                                    </label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="rounded-[2px] border-[#E5E5E5] focus:border-[#1A1A1A] resize-none"
                                        placeholder="Como podemos ajudar?"
                                        data-testid="contact-message"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#E60000] hover:bg-[#CC0000] text-white rounded-[2px] font-semibold btn-lift"
                                    data-testid="contact-submit"
                                >
                                    {loading ? (
                                        'A enviar...'
                                    ) : (
                                        <>
                                            <Send size={16} className="mr-2" />
                                            Enviar Mensagem
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            {/* Quick Contact */}
                            <div className="bg-[#F4F4F4] rounded-[4px] p-6">
                                <h3 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-4">
                                    Contacto Direto
                                </h3>
                                <div className="space-y-4">
                                    {contactInfo.map((info) => (
                                        <a
                                            key={info.label}
                                            href={info.href}
                                            target={info.label === 'Morada' ? '_blank' : undefined}
                                            rel={info.label === 'Morada' ? 'noopener noreferrer' : undefined}
                                            className="flex items-start gap-3 text-[#666666] hover:text-[#E60000] transition-colors"
                                            data-testid={`contact-info-${info.label.toLowerCase()}`}
                                        >
                                            <info.icon size={18} className="mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="block text-xs font-mono uppercase tracking-wider text-[#999999] mb-1">
                                                    {info.label}
                                                </span>
                                                <span className="text-[#1A1A1A] text-sm">
                                                    {info.value}
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                {/* WhatsApp CTA */}
                                <a
                                    href="https://wa.me/351919190993?text=Olá! Tenho uma questão sobre as viaturas disponíveis."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-[2px] font-semibold hover:bg-[#1DA851] transition-colors"
                                    data-testid="contact-whatsapp"
                                >
                                    <MessageCircle size={18} />
                                    Enviar WhatsApp
                                </a>
                            </div>

                            {/* Schedule */}
                            <div className="bg-[#F4F4F4] rounded-[4px] p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock size={18} className="text-[#E60000]" />
                                    <h3 className="font-archivo font-bold text-lg text-[#1A1A1A]">
                                        Horário de Funcionamento
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {schedule.map((item) => (
                                        <div 
                                            key={item.day}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-[#666666]">{item.day}</span>
                                            <span className={`font-medium ${
                                                item.hours === 'Fechado' 
                                                    ? 'text-[#E60000]' 
                                                    : 'text-[#1A1A1A]'
                                            }`}>
                                                {item.hours}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="py-12 md:py-16 bg-[#F4F4F4]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <h2 className="font-archivo font-bold text-2xl text-[#1A1A1A] mb-6">
                        Como Chegar
                    </h2>
                    <div className="aspect-[21/9] bg-white rounded-[4px] overflow-hidden border border-[#E5E5E5]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3046.8!2d-8.4!3d40.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEyJzAwLjAiTiA4wrAyNCcwMC4wIlc!5e0!3m2!1spt-PT!2spt!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localização dANI.PT"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};
