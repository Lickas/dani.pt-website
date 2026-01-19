/**
 * Admin Vehicles List - Supabase Direct
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { toast } from 'sonner';
import { vehiclesAPI } from '../../utils/apiService';

export const AdminVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await vehiclesAPI.getAll();
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Erro ao carregar viaturas');
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem a certeza que deseja eliminar esta viatura?')) return;

        try {
            await vehiclesAPI.delete(id);
            toast.success('Viatura eliminada');
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            toast.error('Erro ao eliminar viatura');
        }
    };

    const toggleSold = async (vehicle) => {
        try {
            await vehiclesAPI.update(vehicle.id, { is_sold: !vehicle.is_sold });
            toast.success(vehicle.is_sold ? 'Viatura disponível' : 'Viatura vendida');
            fetchVehicles();
        } catch (error) {
            toast.error('Erro ao atualizar');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const filteredVehicles = vehicles.filter(v => 
        `${v.brand} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] dark:text-white">
                        Viaturas
                    </h1>
                    <p className="text-[#666666] dark:text-gray-400 mt-1">
                        Gerir o stock de viaturas ({vehicles.length} total)
                    </p>
                </div>
                <Link 
                    to="/admin/viaturas/nova"
                    className="flex items-center gap-2 px-4 py-2 bg-[#E60000] text-white rounded-[2px] font-semibold hover:bg-[#CC0000] transition-colors"
                >
                    <Plus size={18} />
                    Nova Viatura
                </Link>
            </header>

            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
                <input
                    type="text"
                    placeholder="Pesquisar por marca ou modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white rounded-[2px] focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#555]"
                />
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333] rounded-[4px] overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#666666] dark:text-gray-400">
                        A carregar viaturas...
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="p-8 text-center text-[#666666] dark:text-gray-400">
                        {searchTerm ? 'Nenhuma viatura encontrada' : 'Nenhuma viatura registada'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F4F4F4] dark:bg-[#222] border-b border-[#E5E5E5] dark:border-[#333]">
                                <tr>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">Viatura</th>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">Ano</th>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">Preço</th>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">Estado</th>
                                    <th className="text-right p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#333]">
                                {filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="hover:bg-[#F9F9F9] dark:hover:bg-[#222] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-12 bg-[#F4F4F4] dark:bg-[#333] rounded-[2px] overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={vehicle.images?.[0] || 'https://via.placeholder.com/64x48?text=Sem+foto'}
                                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-[#999999] uppercase">{vehicle.brand}</span>
                                                    <span className="font-semibold text-[#1A1A1A] dark:text-white">{vehicle.model}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#666666] dark:text-gray-400">{vehicle.year}</td>
                                        <td className="p-4 font-semibold text-[#1A1A1A] dark:text-white">{formatPrice(vehicle.price)}</td>
                                        <td className="p-4">
                                            <span className={`inline-block px-2 py-1 rounded-[2px] text-xs font-mono uppercase ${
                                                vehicle.is_sold
                                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    : vehicle.is_featured
                                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                                                        : 'bg-green-50 dark:bg-green-900/20 text-green-600'
                                            }`}>
                                                {vehicle.is_sold ? 'Vendido' : vehicle.is_featured ? 'Destaque' : 'Disponível'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => toggleSold(vehicle)}
                                                    title={vehicle.is_sold ? 'Marcar disponível' : 'Marcar vendido'}
                                                    className="p-2 text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F4F4F4] dark:hover:bg-[#333] rounded-[2px] transition-colors"
                                                >
                                                    {vehicle.is_sold ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                                <Link 
                                                    to={`/admin/viaturas/${vehicle.id}`}
                                                    className="p-2 text-[#666666] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F4F4F4] dark:hover:bg-[#333] rounded-[2px] transition-colors"
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    className="p-2 text-[#666666] hover:text-[#E60000] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[2px] transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
