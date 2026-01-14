import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/viaturas', label: 'Viaturas' },
        { href: '/campanhas', label: 'Campanhas' },
        { href: '/sobre', label: 'Sobre' },
        { href: '/contactos', label: 'Contacto' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-transparent dark:border-[#1A1A1A]">
            {/* Linha vermelha superior - assinatura dANI */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E60000]"></div>
            
            <div className="container-site">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" data-testid="logo-link">
                        <img 
                            src={LOGO_URL} 
                            alt="dANI.PT" 
                            className={`h-7 w-auto ${isDark ? 'brightness-0 invert' : ''}`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`text-sm font-medium tracking-wide transition-colors ${
                                    isActive(link.href)
                                        ? 'text-[#E60000]'
                                        : 'text-[#1A1A1A] dark:text-white/80 hover:text-[#666] dark:hover:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-[#666] dark:text-[#999] hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        
                        <a
                            href="tel:+351919190993"
                            className="text-sm font-semibold text-[#1A1A1A] dark:text-white hover:text-[#E60000] transition-colors"
                        >
                            +351 919 190 993
                        </a>
                    </div>

                    {/* Mobile buttons */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-[#666] dark:text-[#999]"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 -mr-2 text-[#1A1A1A] dark:text-white"
                            aria-label="Menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-[#0A0A0A] border-t border-[#E8E8E8] dark:border-[#1A1A1A]">
                    <div className="container-site py-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block text-lg font-medium ${
                                    isActive(link.href) ? 'text-[#E60000]' : 'text-[#1A1A1A] dark:text-white'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-[#E8E8E8] dark:border-[#1A1A1A]">
                            <a href="tel:+351919190993" className="text-lg font-semibold text-[#E60000]">
                                +351 919 190 993
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
