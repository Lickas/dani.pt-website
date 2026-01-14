import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';

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
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminVehicles } from './pages/admin/AdminVehicles';
import { AdminVehicleForm } from './pages/admin/AdminVehicleForm';
import { AdminCampaigns } from './pages/admin/AdminCampaigns';
import { AdminCampaignForm } from './pages/admin/AdminCampaignForm';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
                <div className="animate-pulse">
                    <span className="font-archivo font-black text-2xl text-[#1A1A1A]">
                        dANI<span className="text-[#E60000]">.PT</span>
                    </span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

// Public Layout
const PublicLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <MobileContactBar />
        </>
    );
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/viaturas" element={<PublicLayout><Vehicles /></PublicLayout>} />
            <Route path="/viaturas/:id" element={<PublicLayout><VehicleDetail /></PublicLayout>} />
            <Route path="/sobre" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contactos" element={<PublicLayout><Contact /></PublicLayout>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/*" element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="viaturas" element={<AdminVehicles />} />
                <Route path="viaturas/nova" element={<AdminVehicleForm />} />
                <Route path="viaturas/:id" element={<AdminVehicleForm />} />
                <Route path="campanhas" element={<AdminCampaigns />} />
                <Route path="campanhas/nova" element={<AdminCampaignForm />} />
                <Route path="campanhas/:id" element={<AdminCampaignForm />} />
                <Route path="mensagens" element={<AdminMessages />} />
                <Route path="configuracoes" element={<AdminSettings />} />
                <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
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
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
