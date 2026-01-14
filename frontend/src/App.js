import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileContactBar } from './components/MobileContactBar';

// Public Pages
import { Home } from './pages/Home';
import { Vehicles } from './pages/Vehicles';
import { VehicleDetail } from './pages/VehicleDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminVehicles } from './pages/admin/AdminVehicles';
import { AdminVehicleForm } from './pages/admin/AdminVehicleForm';
import { AdminCampaigns } from './pages/admin/AdminCampaigns';
import { AdminCampaignForm } from './pages/admin/AdminCampaignForm';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';

import './App.css';

// Simple auth check - TODO: Replace with proper JWT validation
const isAuthenticated = () => {
    return localStorage.getItem('dani_admin_token') !== null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
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
        <div className="min-h-screen bg-[#F4F4F4]">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-[#E5E5E5] hidden lg:block">
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-20 flex items-center px-6 border-b border-[#E5E5E5]">
                        <a href="/admin/dashboard" className="flex flex-col">
                            <img 
                                src="https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png" 
                                alt="dANI.PT" 
                                className="h-8 w-auto object-contain"
                            />
                            <span className="text-xs text-[#999999] mt-1">Painel Admin</span>
                        </a>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-3 rounded-[2px] text-sm font-medium transition-colors ${
                                    window.location.pathname.startsWith(item.href)
                                        ? 'bg-[#E60000] text-white'
                                        : 'text-[#666666] hover:bg-[#F4F4F4]'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-[#E5E5E5]">
                        <a href="/" className="block w-full py-2 px-4 text-center text-sm text-[#666666] hover:bg-[#F4F4F4] rounded-[2px] mb-2">
                            Ver Site
                        </a>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 text-sm text-[#E60000] hover:bg-red-50 rounded-[2px]"
                        >
                            Terminar Sessão
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5] h-16 flex items-center justify-between px-4">
                <a href="/admin/dashboard">
                    <img 
                        src="https://customer-assets.emergentagent.com/job_auto-dani-portal/artifacts/3i34e4pv_logo.png" 
                        alt="dANI.PT" 
                        className="h-7 w-auto"
                    />
                </a>
                <button
                    onClick={handleLogout}
                    className="text-sm text-[#E60000]"
                >
                    Sair
                </button>
            </header>

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <div className="p-6 md:p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        background: '#1A1A1A',
                        color: '#FFFFFF',
                        borderRadius: '2px',
                    },
                }}
            />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/viaturas" element={<PublicLayout><Vehicles /></PublicLayout>} />
                <Route path="/viaturas/:id" element={<PublicLayout><VehicleDetail /></PublicLayout>} />
                <Route path="/sobre" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/contactos" element={<PublicLayout><Contact /></PublicLayout>} />

                {/* Admin Login */}
                <Route path="/admin" element={<AdminLogin />} />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminDashboard /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/viaturas" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminVehicles /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/viaturas/nova" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminVehicleForm /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/viaturas/:id" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminVehicleForm /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/campanhas" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminCampaigns /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/campanhas/nova" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminCampaignForm /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/campanhas/:id" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminCampaignForm /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/mensagens" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminMessages /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />
                <Route path="/admin/configuracoes" element={
                    <ProtectedRoute>
                        <AdminLayoutWrapper><AdminSettings /></AdminLayoutWrapper>
                    </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
