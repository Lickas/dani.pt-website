import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/viaturas', label: 'Viaturas' },
        { href: '/sobre', label: 'Sobre' },
        { href: '/contactos', label: 'Contacto' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
            <div className="container-site">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" data-testid="logo-link">
                        <img 
                            src={LOGO_URL} 
                            alt="dANI.PT" 
                            className="h-7 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`text-sm font-medium tracking-wide transition-colors ${
                                    isActive(link.href)
                                        ? 'text-[#E60000]'
                                        : 'text-[#1A1A1A] hover:text-[#666]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:block">
                        <a
                            href="tel:+351919190993"
                            className="text-sm font-semibold text-[#1A1A1A] hover:text-[#E60000] transition-colors"
                        >
                            +351 919 190 993
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 -mr-2"
                        aria-label="Menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-[#E8E8E8]">
                    <div className="container-site py-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block text-lg font-medium ${
                                    isActive(link.href) ? 'text-[#E60000]' : 'text-[#1A1A1A]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-[#E8E8E8]">
                            <a
                                href="tel:+351919190993"
                                className="text-lg font-semibold text-[#E60000]"
                            >
                                +351 919 190 993
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
