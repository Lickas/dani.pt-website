import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_site-renovacao/artifacts/42m6k0x5_Gemini_Generated_Image_n4ngben4ngben4ng.png";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 dark:bg-[#0A0A0A]">
            {/* Red accent line */}
            <div className="h-[2px] bg-gradient-to-r from-[#E60000] via-[#E60000] to-transparent"></div>
            
            {/* Main Footer */}
            <div className="container-site py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand Column */}
                    <div className="md:col-span-4">
                        <Link to="/" className="inline-block">
                            <img 
                                src={LOGO_URL} 
                                alt="dANI.PT" 
                                className="h-7 w-auto brightness-0 invert"
                            />
                        </Link>
                        <div className="mt-6 space-y-4">
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                Escolhidos um a um. Revistos. Testados. Prontos para a estrada.
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="w-8 h-[1px] bg-[#E60000]"></div>
                                <span>Coimbra · Automóveis</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div className="md:col-span-3">
                        <h4 className="text-[11px] font-medium tracking-widest uppercase text-gray-500 mb-5">
                            Contacto
                        </h4>
                        <div className="space-y-4">
                            <a 
                                href="tel:+351919190993"
                                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm group"
                            >
                                <Phone size={16} className="text-gray-500 group-hover:text-[#E60000] transition-colors" />
                                +351 919 190 993
                            </a>
                            <a 
                                href="mailto:daniel.henriques@dani.pt"
                                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm group"
                            >
                                <Mail size={16} className="text-gray-500 group-hover:text-[#E60000] transition-colors" />
                                daniel.henriques@dani.pt
                            </a>
                        </div>
                    </div>

                    {/* Location Column */}
                    <div className="md:col-span-3">
                        <h4 className="text-[11px] font-medium tracking-widest uppercase text-gray-500 mb-5">
                            Morada
                        </h4>
                        <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Rua da Casa Meada 12<br/>
                                Antanhol<br/>
                                3040-584 Coimbra
                            </p>
                        </div>
                    </div>

                    {/* Hours Column */}
                    <div className="md:col-span-2">
                        <h4 className="text-[11px] font-medium tracking-widest uppercase text-gray-500 mb-5">
                            Horário
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-gray-500" />
                            </div>
                            <div className="space-y-1.5 pl-0">
                                <div className="flex justify-between text-gray-300">
                                    <span>Seg—Sex</span>
                                    <span className="text-gray-400">09—19h</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Sábado</span>
                                    <span className="text-gray-400">09—13h</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Domingo</span>
                                    <span>Fechado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-site py-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {currentYear} dANI.PT — Todos os direitos reservados
                    </p>
                    
                    <div className="flex items-center gap-6">
                        <Link 
                            to="/termos"
                            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                        >
                            Termos de Serviço
                        </Link>
                        
                        <Link 
                            to="/privacidade"
                            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                        >
                            Política de Privacidade
                        </Link>
                        
                        <Link 
                            to="/admin"
                            className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                        >
                            Área reservada
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
