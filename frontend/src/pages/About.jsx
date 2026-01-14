import React from 'react';
import { Shield, Users, Award, Clock } from 'lucide-react';

export const About = () => {
    const values = [
        {
            icon: Shield,
            title: 'Transparência',
            description: 'Todas as nossas viaturas são vendidas com histórico completo e sem surpresas.'
        },
        {
            icon: Users,
            title: 'Atendimento Personalizado',
            description: 'Cada cliente é único. Ouvimos as suas necessidades para encontrar o carro ideal.'
        },
        {
            icon: Award,
            title: 'Qualidade Certificada',
            description: 'Rigorosa inspeção mecânica e estética antes de qualquer venda.'
        },
        {
            icon: Clock,
            title: 'Experiência',
            description: 'Anos de experiência no mercado automóvel português.'
        }
    ];

    return (
        <main className="pt-16 md:pt-20 pb-20 md:pb-0">
            {/* Hero */}
            <section className="relative bg-[#1A1A1A] py-20 md:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#E60000]">
                        Sobre Nós
                    </span>
                    <h1 className="font-archivo font-black text-4xl md:text-5xl lg:text-6xl text-white mt-4 leading-tight">
                        A sua confiança<br />
                        é o nosso<br />
                        <span className="text-[#E60000]">motor.</span>
                    </h1>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1676288176820-a5a954d81e6e?w=800&q=80"
                        alt="Showroom"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* Story */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                                A Nossa História
                            </span>
                            <h2 className="font-archivo font-black text-3xl md:text-4xl text-[#1A1A1A] mt-2 mb-6">
                                Paixão pelo<br />automóvel
                            </h2>
                            <div className="space-y-4 text-[#666666] leading-relaxed">
                                <p>
                                    A dANI.PT nasceu da paixão pelo mundo automóvel e do desejo de 
                                    oferecer aos nossos clientes uma experiência de compra diferente: 
                                    transparente, honesta e sem complicações.
                                </p>
                                <p>
                                    Localizados em Coimbra, no coração de Portugal, selecionamos 
                                    criteriosamente cada viatura que entra no nosso stand. Não vendemos 
                                    apenas carros — oferecemos confiança e tranquilidade.
                                </p>
                                <p>
                                    A nossa equipa está preparada para acompanhar cada cliente desde 
                                    o primeiro contacto até muito depois da entrega das chaves, 
                                    garantindo um serviço pós-venda de excelência.
                                </p>
                            </div>
                        </div>
                        <div className="aspect-[4/3] bg-[#F4F4F4] rounded-[4px] overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1718273051927-b5ebaa539222?w=800&q=80"
                                alt="Equipa dANI.PT"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-24 bg-[#F4F4F4]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <div className="text-center mb-12">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                            Os Nossos Valores
                        </span>
                        <h2 className="font-archivo font-black text-3xl md:text-4xl text-[#1A1A1A] mt-2">
                            O que nos define
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div 
                                key={value.title}
                                className="bg-white border border-[#E5E5E5] rounded-[4px] p-6 text-center animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 bg-[#F4F4F4] rounded-[4px] flex items-center justify-center">
                                    <value.icon size={24} className="text-[#E60000]" />
                                </div>
                                <h3 className="font-archivo font-bold text-lg text-[#1A1A1A] mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-[#666666] text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                                Visite-nos
                            </span>
                            <h2 className="font-archivo font-black text-3xl md:text-4xl text-[#1A1A1A] mt-2 mb-6">
                                Estamos em<br />Coimbra
                            </h2>
                            <div className="space-y-4 text-[#666666]">
                                <p className="text-lg">
                                    <strong className="text-[#1A1A1A]">Morada:</strong><br />
                                    Rua da Casa Meada 12<br />
                                    Antanhol, 3040-584 Coimbra
                                </p>
                                <p>
                                    Venha conhecer as nossas instalações e descobrir a viatura 
                                    perfeita para si. Estamos de portas abertas para o receber.
                                </p>
                            </div>
                        </div>
                        <div className="aspect-video bg-[#F4F4F4] rounded-[4px] overflow-hidden">
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
                </div>
            </section>
        </main>
    );
};
