import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getAuthHeaders } = useAuth();

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`${API_URL}/vehicles/all`, {
                headers: getAuthHeaders()
            });
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem a certeza que deseja eliminar esta viatura?')) return;

        try {
            await axios.delete(`${API_URL}/vehicles/${id}`, {
                headers: getAuthHeaders()
            });
            toast.success('Viatura eliminada com sucesso');
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            toast.error('Erro ao eliminar viatura');
        }
    };

    const toggleSold = async (vehicle) => {
        try {
            await axios.put(`${API_URL}/vehicles/${vehicle.id}`, {
                is_sold: !vehicle.is_sold
            }, {
                headers: getAuthHeaders()
            });
            toast.success(vehicle.is_sold ? 'Viatura marcada como disponível' : 'Viatura marcada como vendida');
            fetchVehicles();
        } catch (error) {
            toast.error('Erro ao atualizar viatura');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-archivo font-black text-2xl md:text-3xl text-[#1A1A1A]">
                        Viaturas
                    </h1>
                    <p className="text-[#666666] mt-1">
                        Gerir o stock de viaturas
                    </p>
                </div>
                <Link to="/admin/viaturas/nova">
                    <Button 
                        className="bg-[#E60000] hover:bg-[#CC0000] rounded-[2px]"
                        data-testid="add-vehicle-btn"
                    >
                        <Plus size={18} className="mr-2" />
                        Nova Viatura
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#E5E5E5] rounded-[4px] overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#666666]">
                        A carregar...
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="p-8 text-center text-[#666666]">
                        Nenhuma viatura registada
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full" data-testid="vehicles-table">
                            <thead className="bg-[#F4F4F4] border-b border-[#E5E5E5]">
                                <tr>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">
                                        Viatura
                                    </th>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">
                                        Ano
                                    </th>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">
                                        Preço
                                    </th>
                                    <th className="text-left p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">
                                        Estado
                                    </th>
                                    <th className="text-right p-4 text-xs font-mono uppercase tracking-widest text-[#999999]">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E5E5]">
                                {vehicles.map((vehicle) => (
                                    <tr 
                                        key={vehicle.id}
                                        className="hover:bg-[#F9F9F9] transition-colors"
                                        data-testid={`vehicle-row-${vehicle.id}`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-12 bg-[#F4F4F4] rounded-[2px] overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={vehicle.images?.[0] || 'https://via.placeholder.com/64x48'}
                                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-xs text-[#999999] uppercase">
                                                        {vehicle.brand}
                                                    </span>
                                                    <span className="font-semibold text-[#1A1A1A]">
                                                        {vehicle.model}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#666666]">
                                            {vehicle.year}
                                        </td>
                                        <td className="p-4 font-semibold text-[#1A1A1A]">
                                            {formatPrice(vehicle.price)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-2 py-1 rounded-[2px] text-xs font-mono uppercase ${
                                                vehicle.is_sold
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : vehicle.is_featured
                                                        ? 'bg-red-50 text-red-600'
                                                        : 'bg-green-50 text-green-600'
                                            }`}>
                                                {vehicle.is_sold ? 'Vendido' : vehicle.is_featured ? 'Destaque' : 'Disponível'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleSold(vehicle)}
                                                    title={vehicle.is_sold ? 'Marcar disponível' : 'Marcar vendido'}
                                                    data-testid={`toggle-sold-${vehicle.id}`}
                                                >
                                                    {vehicle.is_sold ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </Button>
                                                <Link to={`/admin/viaturas/${vehicle.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        data-testid={`edit-vehicle-${vehicle.id}`}
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(vehicle.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    data-testid={`delete-vehicle-${vehicle.id}`}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
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
