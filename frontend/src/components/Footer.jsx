import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1A1A1A] text-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link 
                            to="/" 
                            className="inline-block"
                            data-testid="footer-logo"
                        >
                            <img 
                                src={LOGO_URL} 
                                alt="dANI.PT" 
                                className="h-10 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                            Stand de automóveis usados em Coimbra. 
                            Qualidade e confiança desde o primeiro contacto.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-archivo font-bold text-sm uppercase tracking-widest mb-4">
                            Navegação
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link 
                                    to="/" 
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                    data-testid="footer-link-home"
                                >
                                    Início
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/viaturas" 
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                    data-testid="footer-link-viaturas"
                                >
                                    Viaturas
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/sobre" 
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                    data-testid="footer-link-sobre"
                                >
                                    Sobre Nós
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/contactos" 
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                    data-testid="footer-link-contactos"
                                >
                                    Contactos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-archivo font-bold text-sm uppercase tracking-widest mb-4">
                            Contactos
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a 
                                    href="tel:+351919190993" 
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                                    data-testid="footer-phone"
                                >
                                    <Phone size={14} />
                                    +351 919 190 993
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="mailto:daniel.henriques@dani.pt" 
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                                    data-testid="footer-email"
                                >
                                    <Mail size={14} />
                                    daniel.henriques@dani.pt
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-gray-400 text-sm">
                                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                <span>
                                    Rua da Casa Meada 12,<br />
                                    Antanhol, 3040-584 Coimbra
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-archivo font-bold text-sm uppercase tracking-widest mb-4">
                            Horário
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex justify-between">
                                <span>Segunda - Sexta</span>
                                <span>09:00 - 19:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sábado</span>
                                <span>09:00 - 13:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Domingo</span>
                                <span className="text-[#E60000]">Fechado</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        © {currentYear} dANI.PT. Todos os direitos reservados.
                    </p>
                    <p className="text-gray-500 text-xs">
                        Stand de Automóveis Usados em Coimbra
                    </p>
                </div>
            </div>
        </footer>
    );
};
