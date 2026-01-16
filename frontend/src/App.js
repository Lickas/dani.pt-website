import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminVehicles } from './pages/admin/AdminVehicles';
import { AdminVehicleForm } from './pages/admin/AdminVehicleForm';
import { AdminCampaigns } from './pages/admin/AdminCampaigns';
import { AdminCampaignForm } from './pages/admin/AdminCampaignForm';
import { AdminCampaignDetail } from './pages/admin/AdminCampaignDetail';
import { AdminMessages } from './pages/admin/AdminMessages';
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
        <Navbar />
        {children}
        <Footer />
        <MobileContactBar />
    </>
);

// Admin Layout Component
const AdminLayoutWrapper = ({ children }) => {
    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/viaturas', label: 'Viaturas' },
        { href: '/admin/campanhas', label: 'Campanhas' },
        { href: '/admin/mensagens', label: 'Mensagens' },
        { href: '/admin/configuracoes', label: 'Configurações' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('dani_admin_token');
        window.location.href = '/admin';
    };

    return (
        <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#0A0A0A]">
            <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-[#111] border-r border-[#E5E5E5] dark:border-[#222] hidden lg:block">
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center px-6 border-b border-[#E5E5E5] dark:border-[#222]">
                        <a href="/admin/dashboard" className="flex flex-col">
                            <span className="font-display text-2xl text-[#E60000]">dANI.PT</span>
                            <span className="text-xs text-[#999] dark:text-[#666]">Painel Admin</span>
                        </a>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
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
                </div>
            </aside>
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-b border-[#E5E5E5] dark:border-[#222] h-16 flex items-center justify-between px-4">
                <a href="/admin/dashboard">
                    <span className="font-display text-xl text-[#E60000]">dANI.PT</span>
                </a>
                <button onClick={handleLogout} className="text-sm text-[#E60000]">Sair</button>
            </header>
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
                    <Route path="/admin/configuracoes" element={<ProtectedRoute><AdminLayoutWrapper><AdminSettings /></AdminLayoutWrapper></ProtectedRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
