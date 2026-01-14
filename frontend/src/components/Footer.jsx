import React from 'react';
import { Link } from 'react-router-dom';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1A1A1A] dark:bg-[#0A0A0A]">
            {/* Main Footer */}
            <div className="container-site py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand Column */}
                    <div className="md:col-span-5">
                        <Link to="/">
                            <img 
                                src={LOGO_URL} 
                                alt="dANI.PT" 
                                className="h-8 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="mt-6 text-white/50 text-sm leading-relaxed max-w-sm">
                            Selecionados. Revistos. Prontos.<br/>
                            Stand de automóveis usados em Coimbra.
                        </p>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-3">
                        <span className="label-style text-white/30">Contacto</span>
                        <div className="mt-4 space-y-3">
                            <a 
                                href="tel:+351919190993"
                                className="block text-white/70 hover:text-white transition-colors text-sm"
                            >
                                +351 919 190 993
                            </a>
                            <a 
                                href="mailto:daniel.henriques@dani.pt"
                                className="block text-white/70 hover:text-white transition-colors text-sm"
                            >
                                daniel.henriques@dani.pt
                            </a>
                        </div>
                    </div>

                    {/* Location Column */}
                    <div className="md:col-span-2">
                        <span className="label-style text-white/30">Morada</span>
                        <p className="mt-4 text-white/70 text-sm leading-relaxed">
                            Rua da Casa Meada 12<br/>
                            Antanhol<br/>
                            3040-584 Coimbra
                        </p>
                    </div>

                    {/* Hours Column */}
                    <div className="md:col-span-2">
                        <span className="label-style text-white/30">Horário</span>
                        <div className="mt-4 space-y-1 text-sm">
                            <div className="flex justify-between text-white/70">
                                <span>Seg—Sex</span>
                                <span>09—19h</span>
                            </div>
                            <div className="flex justify-between text-white/70">
                                <span>Sábado</span>
                                <span>09—13h</span>
                            </div>
                            <div className="flex justify-between text-white/40">
                                <span>Domingo</span>
                                <span>Fechado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container-site py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/30 text-xs">
                        © {currentYear} dANI.PT — Todos os direitos reservados
                    </p>
                    
                    <div className="flex items-center gap-6">
                        <Link 
                            to="/admin"
                            className="text-white/20 hover:text-white/40 text-xs transition-colors"
                        >
                            Área reservada
                        </Link>
                        
                        <a 
                            href="https://leandroxws.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/30 hover:text-white/50 text-xs transition-colors"
                        >
                            Made with ♥ by Oxiria Studios
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
