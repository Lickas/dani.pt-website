import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NewsletterSection } from './components/NewsletterSection';
import { MobileContactBar } from './components/MobileContactBar';
import { DemoModeBanner } from './components/DemoModeBanner';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import { Home } from './pages/Home';
import { Vehicles } from './pages/Vehicles';
import { VehicleDetail } from './pages/VehicleDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Campaigns } from './pages/Campaigns';
import { CampaignDetail } from './pages/CampaignDetail';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminVehicles } from './pages/admin/AdminVehicles';
import { AdminVehicleForm } from './pages/admin/AdminVehicleForm';
import { AdminCampaigns } from './pages/admin/AdminCampaigns';
import { AdminCampaignForm } from './pages/admin/AdminCampaignForm';
import { AdminCampaignDetail } from './pages/admin/AdminCampaignDetail';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminNewsletter } from './pages/admin/AdminNewsletter';
import { AdminSettings } from './pages/admin/AdminSettings';

import './App.css';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
};

// Token validation helper
const isTokenValid = () => {
    const token = localStorage.getItem('dani_admin_token');
    if (!token) return false;
    
    try {
        // Decode JWT payload (base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token is expired (exp is in seconds)
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch (e) {
        // Invalid token format
        localStorage.removeItem('dani_admin_token');
        return false;
    }
};

// Simple auth check
const isAuthenticated = () => {
    return isTokenValid();
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // Clear invalid token if present
        localStorage.removeItem('dani_admin_token');
        return <Navigate to="/admin" replace />;
    }
    return children;
};

// Public Layout
const PublicLayout = ({ children }) => (
    <>
        <DemoModeBanner />
        <Navbar />
        {children}
        <NewsletterSection />
        <Footer />
        <MobileContactBar />
    </>
);

// Admin Layout Component (Com Menu Mobile Otimizado)
const AdminLayoutWrapper = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Fecha o menu mobile sempre que a rota mudar
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/viaturas', label: 'Viaturas' },
        { href: '/admin/campanhas', label: 'Campanhas' },
        { href: '/admin/mensagens', label: 'Mensagens' },
        { href: '/admin/newsletter', label: 'Newsletter' },
        { href: '/admin/configuracoes', label: 'Configurações' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('dani_admin_token');
        window.location.href = '/admin';
    };

    // Conteúdo da Navegação (Reutilizável)
    const NavContent = () => (
        <>
            <div className="h-20 flex items-center px-6 border-b border-[#E5E5E5] dark:border-[#222]">
                <a href="/admin/dashboard" className="flex flex-col">
                    <span className="font-display text-2xl text-[#E60000]">dANI.PT</span>
                    <span className="text-xs text-[#999] dark:text-[#666]">Painel Admin</span>
                </a>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-3 text-sm font-medium transition-colors ${
                            window.location.pathname.startsWith(item.href)
                                ? 'bg-[#E60000] text-white'
                                : 'text-[#666] dark:text-[#999] hover:bg-[#F4F4F4] dark:hover:bg-[#1A1A1A]'
                        }`}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-[#E5E5E5] dark:border-[#222]">
                <a href="/" className="block w-full py-2 px-4 text-center text-sm text-[#666] dark:text-[#999] hover:bg-[#F4F4F4] dark:hover:bg-[#1A1A1A] mb-2">
                    Ver Site
                </a>
                <button onClick={handleLogout} className="w-full py-2 px-4 text-sm text-[#E60000] hover:bg-red-50 dark:hover:bg-red-900/20">
                    Terminar Sessão
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#0A0A0A]">
            {/* SIDEBAR DESKTOP (Visível apenas em LG+) */}
            <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-[#111] border-r border-[#E5E5E5] dark:border-[#222] hidden lg:flex flex-col">
                <NavContent />
            </aside>

            {/* HEADER MOBILE (Visível apenas abaixo de LG) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-[#111] border-b border-[#E5E5E5] dark:border-[#222] h-16 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {/* Botão Hamburger */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-[#666] dark:text-[#999] hover:bg-gray-100 dark:hover:bg-[#222]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <a href="/admin/dashboard">
                        <span className="font-display text-xl text-[#E60000]">dANI.PT</span>
                    </a>
                </div>
            </header>

            {/* SIDEBAR MOBILE OVERLAY */}
            {isMobileMenuOpen && (
                <div className="relative z-50 lg:hidden">
                    {/* Fundo Escuro (Backdrop) */}
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Menu Gaveta */}
                    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#111] shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out h-full">
                        {/* Botão Fechar */}
                        <div className="absolute top-4 right-4 z-10">
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-[#666] dark:text-[#999]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Conteúdo do Menu */}
                        <NavContent />
                    </div>
                </div>
            )}

            {/* CONTEÚDO PRINCIPAL */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <div className="p-6 md:p-8 lg:p-12">{children}</div>
            </main>
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <ScrollToTop />
                <Toaster 
                    position="top-right" 
                    toastOptions={{
                        style: {
                            background: '#1A1A1A',
                            color: '#FFFFFF',
                            borderRadius: '0px',
                        },
                    }}
                />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/viaturas" element={<PublicLayout><Vehicles /></PublicLayout>} />
                    <Route path="/viaturas/:id" element={<PublicLayout><VehicleDetail /></PublicLayout>} />
                    <Route path="/campanhas" element={<PublicLayout><Campaigns /></PublicLayout>} />
                    <Route path="/campanhas/:id" element={<PublicLayout><CampaignDetail /></PublicLayout>} />
                    <Route path="/sobre" element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/contactos" element={<PublicLayout><Contact /></PublicLayout>} />
                    <Route path="/termos" element={<PublicLayout><TermsOfService /></PublicLayout>} />
                    <Route path="/privacidade" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayoutWrapper><AdminDashboard /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/viaturas" element={<ProtectedRoute><AdminLayoutWrapper><AdminVehicles /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/viaturas/nova" element={<ProtectedRoute><AdminLayoutWrapper><AdminVehicleForm /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/viaturas/:id" element={<ProtectedRoute><AdminLayoutWrapper><AdminVehicleForm /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/campanhas" element={<ProtectedRoute><AdminLayoutWrapper><AdminCampaigns /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/campanhas/nova" element={<ProtectedRoute><AdminLayoutWrapper><AdminCampaignForm /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/campanhas/ver/:id" element={<ProtectedRoute><AdminLayoutWrapper><AdminCampaignDetail /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/campanhas/editar/:id" element={<ProtectedRoute><AdminLayoutWrapper><AdminCampaignForm /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/mensagens" element={<ProtectedRoute><AdminLayoutWrapper><AdminMessages /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/newsletter" element={<ProtectedRoute><AdminLayoutWrapper><AdminNewsletter /></AdminLayoutWrapper></ProtectedRoute>} />
                    <Route path="/admin/configuracoes" element={<ProtectedRoute><AdminLayoutWrapper><AdminSettings /></AdminLayoutWrapper></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;