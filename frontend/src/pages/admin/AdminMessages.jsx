import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Mail, MailOpen, Trash2, Phone, Car } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const { getAuthHeaders } = useAuth();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/contacts`, {
                headers: getAuthHeaders()
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await axios.put(`${API_URL}/contacts/${id}/read`, {}, {
                headers: getAuthHeaders()
            });
            setMessages(prev => prev.map(m => 
                m.id === id ? { ...m, is_read: true } : m
            ));
        } catch (error) {
            toast.error('Erro ao marcar mensagem');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem a certeza que deseja eliminar esta mensagem?')) return;

        try {
            await axios.delete(`${API_URL}/contacts/${id}`, {
                headers: getAuthHeaders()
            });
            toast.success('Mensagem eliminada');
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            toast.error('Erro ao eliminar mensagem');
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "d 'de' MMMM, HH:mm", { locale: pt });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-archivo font-black text-2xl md:text-3xl text-[#1A1A1A]">
                    Mensagens
                </h1>
                <p className="text-[#666666] mt-1">
                    Mensagens recebidas através do formulário de contacto
                </p>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 bg-white border border-[#E5E5E5] rounded-[4px] overflow-hidden">
                    {loading ? (
                        <div className="p-4 text-center text-[#666666]">
                            A carregar...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="p-8 text-center text-[#666666]">
                            <Mail size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Nenhuma mensagem recebida</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E5E5E5] max-h-[600px] overflow-y-auto" data-testid="messages-list">
                            {messages.map((message) => (
                                <button
                                    key={message.id}
                                    onClick={() => {
                                        setSelectedMessage(message);
                                        if (!message.is_read) handleMarkRead(message.id);
                                    }}
                                    className={`w-full text-left p-4 hover:bg-[#F9F9F9] transition-colors ${
                                        selectedMessage?.id === message.id ? 'bg-[#F4F4F4]' : ''
                                    } ${!message.is_read ? 'bg-red-50' : ''}`}
                                    data-testid={`message-item-${message.id}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {!message.is_read && (
                                                    <span className="w-2 h-2 bg-[#E60000] rounded-full flex-shrink-0" />
                                                )}
                                                <span className="font-semibold text-[#1A1A1A] truncate">
                                                    {message.name}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#666666] truncate mt-1">
                                                {message.message}
                                            </p>
                                            <span className="text-xs text-[#999999] mt-1 block">
                                                {formatDate(message.created_at)}
                                            </span>
                                        </div>
                                        {message.is_read ? (
                                            <MailOpen size={16} className="text-[#999999] flex-shrink-0" />
                                        ) : (
                                            <Mail size={16} className="text-[#E60000] flex-shrink-0" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-[4px] p-6">
                    {selectedMessage ? (
                        <div data-testid="message-detail">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="font-archivo font-bold text-xl text-[#1A1A1A]">
                                        {selectedMessage.name}
                                    </h2>
                                    <span className="text-sm text-[#999999]">
                                        {formatDate(selectedMessage.created_at)}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    data-testid="delete-message-btn"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={16} className="text-[#999999]" />
                                    <a 
                                        href={`mailto:${selectedMessage.email}`}
                                        className="text-[#E60000] hover:underline"
                                    >
                                        {selectedMessage.email}
                                    </a>
                                </div>
                                {selectedMessage.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone size={16} className="text-[#999999]" />
                                        <a 
                                            href={`tel:${selectedMessage.phone}`}
                                            className="text-[#1A1A1A] hover:text-[#E60000]"
                                        >
                                            {selectedMessage.phone}
                                        </a>
                                    </div>
                                )}
                                {selectedMessage.vehicle_id && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Car size={16} className="text-[#999999]" />
                                        <span className="text-[#666666]">
                                            Ref. Viatura: {selectedMessage.vehicle_id}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#F4F4F4] rounded-[4px] p-4">
                                <h3 className="font-semibold text-sm text-[#1A1A1A] mb-2">
                                    Mensagem
                                </h3>
                                <p className="text-[#666666] whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <a href={`mailto:${selectedMessage.email}`} className="flex-1">
                                    <Button 
                                        className="w-full bg-[#E60000] hover:bg-[#CC0000] rounded-[2px]"
                                        data-testid="reply-email-btn"
                                    >
                                        <Mail size={16} className="mr-2" />
                                        Responder por Email
                                    </Button>
                                </a>
                                {selectedMessage.phone && (
                                    <a href={`tel:${selectedMessage.phone}`} className="flex-1">
                                        <Button 
                                            variant="outline"
                                            className="w-full rounded-[2px]"
                                        >
                                            <Phone size={16} className="mr-2" />
                                            Ligar
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-[#999999]">
                            <div className="text-center">
                                <Mail size={48} className="mx-auto mb-4 opacity-30" />
                                <p>Selecione uma mensagem para ver os detalhes</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
