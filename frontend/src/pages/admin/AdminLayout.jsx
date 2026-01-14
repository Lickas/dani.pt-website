import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Car, Megaphone, Mail, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/viaturas', label: 'Viaturas', icon: Car },
        { href: '/admin/campanhas', label: 'Campanhas', icon: Megaphone },
        { href: '/admin/mensagens', label: 'Mensagens', icon: Mail },
        { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-[#F4F4F4]">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5] h-16 flex items-center justify-between px-4">
                <Link to="/admin/dashboard" className="font-archivo font-black text-xl text-[#1A1A1A]">
                    dANI<span className="text-[#E60000]">.PT</span>
                </Link>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-[#1A1A1A]"
                    data-testid="mobile-menu-toggle"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-[#E5E5E5] z-40 transform transition-transform lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 lg:h-20 flex items-center px-6 border-b border-[#E5E5E5]">
                        <Link 
                            to="/admin/dashboard" 
                            className="font-archivo font-black text-xl text-[#1A1A1A]"
                            data-testid="admin-logo"
                        >
                            dANI<span className="text-[#E60000]">.PT</span>
                            <span className="block text-xs font-inter font-normal text-[#999999]">Admin</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                data-testid={`nav-${item.label.toLowerCase()}`}
                                className={`flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-[#E60000] text-white'
                                        : 'text-[#666666] hover:bg-[#F4F4F4] hover:text-[#1A1A1A]'
                                }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User / Logout */}
                    <div className="p-4 border-t border-[#E5E5E5]">
                        <div className="mb-4 px-4">
                            <span className="block text-xs text-[#999999]">Sessão iniciada como</span>
                            <span className="block text-sm font-medium text-[#1A1A1A] truncate">
                                {user?.email}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <Link to="/" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start rounded-[2px]"
                                    data-testid="view-site-btn"
                                >
                                    Ver Site
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start text-[#666666] hover:text-[#E60000] rounded-[2px]"
                                data-testid="logout-btn"
                            >
                                <LogOut size={18} className="mr-2" />
                                Terminar Sessão
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
                <div className="p-6 md:p-8 lg:p-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
