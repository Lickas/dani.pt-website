import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const About = () => {
    return (
        <main className="pt-20">
            {/* ============================================
                HERO - Impactful Statement
                ============================================ */}
            <section className="min-h-[70vh] flex items-center bg-[#1A1A1A] relative overflow-hidden">
                {/* Linha vermelha superior */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E60000]"></div>
                
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
                </div>

                <div className="container-site relative z-10 py-24">
                    <div className="flex items-start gap-6">
                        <div className="hidden md:block w-[2px] h-32 bg-[#E60000]"></div>
                        <div>
                            <span className="label-style text-white/30">Quem sou</span>
                            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white mt-4 max-w-4xl">
                                Confiança<br/>
                                não se<br/>
                                <span className="text-[#E60000]">compra.</span>
                            </h1>
                            <p className="text-white/70 text-lg mt-8 max-w-lg">
                                Conquista-se. Viatura a viatura.<br/>Cliente a cliente.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                PHILOSOPHY - Asymmetric Layout
                ============================================ */}
            <section className="py-24 md:py-32">
                <div className="container-site">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                        {/* Left - Small */}
                        <div className="lg:col-span-4">
                            <div className="flex items-start gap-4 mb-4">
                                <span className="section-number">01</span>
                                <span className="label-style text-[#999]">Filosofia</span>
                            </div>
                            <h2 className="font-display text-4xl md:text-5xl text-[#1A1A1A] mt-2">
                                Escolhidos.<br/>
                                Revistos.<br/>
                                Prontos.
                            </h2>
                        </div>

                        {/* Right - Large */}
                        <div className="lg:col-span-8 lg:pt-12">
                            <p className="dani-quote text-lg leading-relaxed">
                                Na dANI.PT não aceito qualquer viatura. Cada carro que entra no meu stand 
                                passa por seleção criteriosa e revisão completa.
                            </p>
                            <p className="dani-quote text-lg leading-relaxed mt-6">
                                Sem promessas vazias. Só honestidade. Quando compra uma viatura comigo, 
                                sabe exatamente o que está a levar.
                            </p>
                            <div className="mt-12 flex items-center gap-8">
                                <div>
                                    <span className="font-display text-5xl text-[#E60000]">100%</span>
                                    <span className="block text-sm text-[#999] mt-1">Revistos</span>
                                </div>
                                <div className="w-px h-16 bg-[#E8E8E8]"></div>
                                <div>
                                    <span className="font-display text-5xl text-[#1A1A1A]">Garantia</span>
                                    <span className="block text-sm text-[#999] mt-1">Incluída</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                IMAGE BREAK
                ============================================ */}
            <section className="h-[50vh] md:h-[60vh] bg-[#F5F5F5] relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600&q=80"
                    alt="Stand dANI.PT"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </section>

            {/* ============================================
                VALUES - Minimal List
                ============================================ */}
            <section className="py-24 md:py-32 bg-[#FAFAFA]">
                <div className="container-site">
                    <span className="label-style text-[#999]">Valores</span>
                    <h2 className="font-display text-5xl md:text-6xl text-[#1A1A1A] mt-2 mb-16">
                        O que me define
                    </h2>

                    <div className="space-y-0">
                        {[
                            { title: 'Transparência', desc: 'Histórico completo. Sem letras pequenas. Sem surpresas.' },
                            { title: 'Qualidade', desc: 'Cada viatura inspecionada ao detalhe antes de chegar ao cliente.' },
                            { title: 'Respeito', desc: 'Pelo seu tempo, pelo seu dinheiro, pela sua decisão.' },
                        ].map((value, index) => (
                            <div 
                                key={value.title}
                                className="py-8 border-b border-[#E8E8E8] grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                            >
                                <span className="md:col-span-1 font-display text-2xl text-[#E8E8E8]">
                                    0{index + 1}
                                </span>
                                <h3 className="md:col-span-4 font-display text-3xl md:text-4xl text-[#1A1A1A]">
                                    {value.title}
                                </h3>
                                <p className="md:col-span-7 text-[#666]">
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                LOCATION
                ============================================ */}
            <section className="py-24 md:py-32">
                <div className="container-site">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="label-style text-[#999]">Localização</span>
                            <h2 className="font-display text-5xl md:text-6xl text-[#1A1A1A] mt-2">
                                Estamos em<br/>Coimbra
                            </h2>
                            <p className="text-xl text-[#666] mt-6">
                                Rua da Casa Meada 12<br/>
                                Antanhol, 3040-584
                            </p>
                            <div className="mt-8">
                                <Link to="/contactos" className="btn-secondary">
                                    Ver no mapa
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                        <div className="aspect-square bg-[#F5F5F5] overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3046.8!2d-8.4!3d40.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDEyJzAwLjAiTiA4wrAyNCcwMC4wIlc!5e0!3m2!1spt-PT!2spt!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Localização"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                CTA
                ============================================ */}
            <section className="py-24 md:py-32 bg-[#1A1A1A]">
                <div className="container-site text-center">
                    <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white">
                        Pronto para<br/>
                        <span className="text-[#E60000]">conduzir?</span>
                    </h2>
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/viaturas" className="btn-primary">
                            Ver viaturas
                        </Link>
                        <a href="tel:+351919190993" className="btn-outline border-white/20 text-white hover:border-white/40">
                            Ligar agora
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};
