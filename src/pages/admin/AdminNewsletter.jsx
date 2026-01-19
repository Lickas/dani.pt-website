
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, Trash2, Download, Search } from 'lucide-react';
import { toast } from 'sonner';

export const AdminNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const { data, error } = await supabase
                .from('newsletter_subscribers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // Garantir que é um array
            setSubscribers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            toast.error('Erro ao carregar subscritores.');
            setSubscribers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem a certeza que deseja remover este email?')) return;

        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            setSubscribers(subscribers.filter(sub => sub.id !== id));
            toast.success('Email removido com sucesso.');
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            toast.error('Erro ao remover email.');
        }
    };

    const handleExport = () => {
        if (subscribers.length === 0) return;

        const csvContent = "data:text/csv;charset=utf-8," 
            + "Email,Data de Subscrição\n"
            + subscribers.map(sub => `${sub.email},${new Date(sub.created_at).toLocaleDateString()}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "newsletter_subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSubscribers = subscribers.filter(sub => 
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-[#E60000]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Gerencie a sua lista de subscritores.
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm hover:opacity-90 transition-opacity text-sm font-medium"
                >
                    <Download size={16} />
                    Exportar CSV
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Pesquisar email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-sm text-sm outline-none focus:border-[#E60000]"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-[#222] text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-[#333]">
                            <tr>
                                <th className="px-6 py-3 w-2/3">Email</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                            {filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-[#222] transition-colors">
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {new Date(sub.created_at).toLocaleDateString('pt-PT', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                                        {searchTerm ? 'Nenhum resultado encontrado.' : 'Ainda não existem subscritores.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="text-xs text-gray-400 text-center">
                Total: {filteredSubscribers.length} subscritores
            </div>
        </div>
    );
};
