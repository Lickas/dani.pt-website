import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Eye } from 'lucide-react';
import { rentingAPI } from '../../utils/apiService';
import { toast } from 'sonner';

export const AdminRenting = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const data = await rentingAPI.getAllAdmin();
            setOffers(data);
        } catch (error) {
            console.error('Error fetching offers:', error);
            toast.error('Erro ao carregar ofertas');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem a certeza que deseja eliminar esta oferta?')) return;

        try {
            await rentingAPI.delete(id);
            setOffers(offers.filter(o => o.id !== id));
            toast.success('Oferta eliminada com sucesso');
        } catch (error) {
            console.error('Error deleting offer:', error);
            toast.error('Erro ao eliminar oferta');
        }
    };

    const filteredOffers = offers.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Renting</h1>
                    <p className="text-sm text-gray-500">Gerir ofertas de renting</p>
                </div>
                <Link
                    to="/admin/renting/nova"
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Nova Oferta
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#111] p-4 rounded-sm border border-gray-100 dark:border-gray-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar ofertas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#E60000]"
                    />
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12">Carregando...</div>
            ) : filteredOffers.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#111] rounded-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-500">Nenhuma oferta encontrada.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredOffers.map(offer => (
                        <div
                            key={offer.id}
                            className="bg-white dark:bg-[#111] p-4 rounded-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-4"
                        >
                            {/* Image */}
                            <div className="w-full md:w-24 h-24 md:h-16 bg-gray-100 dark:bg-gray-900 rounded-sm overflow-hidden flex-shrink-0">
                                <img
                                    src={offer.image_url}
                                    alt={offer.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{offer.title}</h3>
                                <p className="text-xs text-gray-500">{offer.subtitle}</p>
                                <div className="mt-1 flex items-center justify-center md:justify-start gap-2">
                                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm ${
                                        offer.is_active
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                        {offer.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                    {offer.category === 'business' && (
                                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-sm bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                            Empresas
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Link
                                    to={`/renting/${offer.id}`}
                                    target="_blank"
                                    className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    title="Ver no site"
                                >
                                    <Eye size={18} />
                                </Link>
                                <Link
                                    to={`/admin/renting/editar/${offer.id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-sm transition-colors"
                                    title="Editar"
                                >
                                    <Edit2 size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(offer.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-sm transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
