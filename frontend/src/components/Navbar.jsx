import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/button';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/viaturas', label: 'Viaturas' },
        { href: '/sobre', label: 'Sobre' },
        { href: '/contactos', label: 'Contactos' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center"
                        data-testid="logo-link"
                    >
                        <img 
                            src={LOGO_URL} 
                            alt="dANI.PT - Stand de Automóveis" 
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                data-testid={`nav-${link.label.toLowerCase()}`}
                                className={`font-inter text-sm font-medium tracking-wide transition-colors ${
                                    isActive(link.href)
                                        ? 'text-[#E60000]'
                                        : 'text-[#1A1A1A] hover:text-[#E60000]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="tel:+351919190993"
                            className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A] hover:text-[#E60000] transition-colors"
                            data-testid="phone-cta-desktop"
                        >
                            <Phone size={16} />
                            <span>919 190 993</span>
                        </a>
                        <Link to="/admin">
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="rounded-[2px] border-[#E5E5E5] hover:border-[#1A1A1A]"
                                data-testid="admin-btn"
                            >
                                Admin
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-[#1A1A1A]"
                        data-testid="mobile-menu-btn"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-[#E5E5E5] animate-fade-in">
                    <div className="px-6 py-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                                className={`block font-inter text-base font-medium py-2 ${
                                    isActive(link.href)
                                        ? 'text-[#E60000]'
                                        : 'text-[#1A1A1A]'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="border-[#E5E5E5]" />
                        <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="block font-inter text-base font-medium py-2 text-[#1A1A1A]"
                            data-testid="mobile-admin-link"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
