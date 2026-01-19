import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { contactsAPI } from '../utils/apiService';

export const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await contactsAPI.create(formData);
            toast.success('Mensagem enviada! Responderemos brevemente.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast.error('Erro ao enviar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pt-20">
            {/* ============================================
                HEADER
                ============================================ */}
            <section className="bg-[#FAFAFA] py-16 md:py-24">
                <div className="container-site">
                    <div className="flex items-start gap-6">
                        <div className="w-[2px] h-20 bg-[#E60000] hidden md:block"></div>
                        <div>
                            <span className="label-style text-[#999]">Contacto</span>
                            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-[#1A1A1A] mt-2">
                                Fale<br/>comigo
                            </h1>
                            <p className="dani-quote mt-4">
                                Perguntas diretas. Respostas diretas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                CONTENT
                ============================================ */}
            <section className="py-16 md:py-24">
                <div className="container-site">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* ================================
                            LEFT - Contact Info
                            ================================ */}
                        <div className="lg:col-span-5">
                            <div className="space-y-8">
                                {/* Phone */}
                                <div>
                                    <span className="label-style text-[#999]">Telefone</span>
                                    <a 
                                        href="tel:+351919190993"
                                        className="block text-2xl font-semibold text-[#1A1A1A] mt-2 hover:text-[#E60000] transition-colors"
                                    >
                                        +351 919 190 993
                                    </a>
                                </div>

                                {/* Email */}
                                <div>
                                    <span className="label-style text-[#999]">Email</span>
                                    <a 
                                        href="mailto:daniel.henriques@dani.pt"
                                        className="block text-lg text-[#1A1A1A] mt-2 hover:text-[#E60000] transition-colors"
                                    >
                                        daniel.henriques@dani.pt
                                    </a>
                                </div>

                                {/* Address */}
                                <div>
                                    <span className="label-style text-[#999]">Morada</span>
                                    <p className="text-lg text-[#1A1A1A] mt-2">
                                        Rua da Casa Meada 12<br/>
                                        Antanhol, 3040-584 Coimbra
                                    </p>
                                </div>

                                {/* Hours */}
                                <div>
                                    <span className="label-style text-[#999]">Horário</span>
                                    <div className="mt-2 space-y-1 text-[#1A1A1A]">
                                        <div className="flex justify-between max-w-[200px]">
                                            <span>Seg—Sáb</span>
                                            <span>09:00—20:00</span>
                                        </div>
                                        <div className="flex justify-between max-w-[200px] text-[#999]">
                                            <span>Domingo</span>
                                            <span>Fechado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp Button */}
                                <a
                                    href="https://wa.me/351919190993?text=Olá! Gostava de saber mais informações."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold hover:bg-[#1DA851] transition-colors"
                                >
                                    <MessageCircle size={18} />
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* ================================
                            RIGHT - Form
                            ================================ */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#FAFAFA] p-8 md:p-12">
                                <h2 className="font-display text-3xl text-[#1A1A1A] mb-8">
                                    Envie mensagem
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label className="label-style text-[#999] mb-2 block">
                                            Nome
                                        </label>
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
                                            <label className="label-style text-[#999] mb-2 block">
                                                Email
                                            </label>
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
                                            <label className="label-style text-[#999] mb-2 block">
                                                Telefone
                                            </label>
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
                                        <label className="label-style text-[#999] mb-2 block">
                                            Mensagem
                                        </label>
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

            {/* ============================================
                MAP
                ============================================ */}
            <section className="h-[400px] md:h-[500px] bg-[#F5F5F5]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3046.8!2d-8.4!3d40.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEyJzAwLjAiTiA4wrAyNCcwMC4wIlc!5e0!3m2!1spt-PT!2spt!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Localização dANI.PT"
                />
            </section>
        </main>
    );
};
