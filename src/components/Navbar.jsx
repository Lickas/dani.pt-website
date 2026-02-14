import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_site-renovacao/artifacts/42m6k0x5_Gemini_Generated_Image_n4ngben4ngben4ng.png";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const { isDark, toggleTheme } = useTheme();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/viaturas', label: 'Viaturas' },
        { href: '/renting', label: 'Renting' },
        { href: '/campanhas', label: 'Campanhas' },
        { href: '/sobre', label: 'Sobre' },
        { href: '/contactos', label: 'Contacto' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md shadow-sm' 
                    : 'bg-white/80 dark:bg-[#111827]/80 backdrop-blur-sm'
            }`}>
                {/* Linha vermelha superior - assinatura dANI */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E60000]"></div>
                
                <div className="container-site">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link 
                            to="/" 
                            data-testid="logo-link"
                            className="relative z-10 transition-opacity hover:opacity-80"
                        >
                            <img 
                                src={LOGO_URL} 
                                alt="dANI.PT" 
                                className={`h-10 md:h-12 w-auto transition-all ${isDark ? 'brightness-0 invert' : ''}`}
                            />
                        </Link>

                        {/* Desktop Navigation - Center */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded-sm ${
                                        isActive(link.href)
                                            ? 'text-[#E60000]'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }`}
                                >
                                    {link.label}
                                    {isActive(link.href) && (
                                        <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#E60000] rounded-full"></span>
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right side */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                                aria-label="Alternar tema"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            
                            {/* Phone CTA */}
                            <a
                                href="tel:+351919190993"
                                className="ml-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#E60000] hover:bg-[#CC0000] transition-colors duration-200 rounded-sm"
                            >
                                <Phone size={14} />
                                <span className="hidden lg:inline">919 190 993</span>
                            </a>
                        </div>

                        {/* Mobile buttons */}
                        <div className="md:hidden flex items-center gap-1">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 text-gray-500 dark:text-gray-400"
                                aria-label="Alternar tema"
                            >
                                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2.5 text-gray-700 dark:text-gray-200"
                                aria-label="Menu"
                            >
                                {isOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Slide down */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="bg-white dark:bg-[#111827] border-t border-gray-100 dark:border-gray-800">
                        <div className="container-site py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`block px-4 py-3 text-base font-medium rounded-sm transition-all ${
                                        isActive(link.href) 
                                            ? 'text-[#E60000] bg-red-50 dark:bg-red-900/10' 
                                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800">
                                <a 
                                    href="tel:+351919190993" 
                                    className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-[#E60000]"
                                >
                                    <Phone size={18} />
                                    +351 919 190 993
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Overlay for mobile menu */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};
