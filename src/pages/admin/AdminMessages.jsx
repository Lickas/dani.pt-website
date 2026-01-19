/**
 * Admin Messages
 * 
 * TODO: Implementar respostas rápidas templates
 * TODO: Adicionar etiquetas/categorias
 * TODO: Exportar leads para CSV
 * TODO: Integrar com CRM externo
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, MailOpen, Trash2, Phone, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || '';
const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api';

export const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('dani_admin_token');
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/contacts`, {
                headers: getAuthHeaders()
            });
            // Garantir que é um array
            setMessages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
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
            console.error('Error marking read:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Eliminar esta mensagem?')) return;

        try {
            await axios.delete(`${API_URL}/contacts/${id}`, {
                headers: getAuthHeaders()
            });
            toast.success('Mensagem eliminada');
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            toast.error('Erro ao eliminar');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = messages.filter(m => !m.is_read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                    Mensagens
                </h1>
                <p className="text-[#666666] mt-1">
                    {unreadCount > 0 
                        ? `${unreadCount} mensagem${unreadCount > 1 ? 's' : ''} não lida${unreadCount > 1 ? 's' : ''}`
                        : 'Todas as mensagens lidas'
                    }
                </p>
            </header>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 bg-white border border-[#E5E5E5] rounded-[4px] overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-[#666666]">
                            A carregar...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="p-8 text-center text-[#666666]">
                            <Mail size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Nenhuma mensagem</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E5E5E5] max-h-[600px] overflow-y-auto">
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
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                {!message.is_read && (
                                                    <span className="w-2 h-2 bg-[#E60000] rounded-full" />
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
                                            <MailOpen size={16} className="text-[#999999]" />
                                        ) : (
                                            <Mail size={16} className="text-[#E60000]" />
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
                        <div>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="font-bold text-xl text-[#1A1A1A]">
                                        {selectedMessage.name}
                                    </h2>
                                    <span className="text-sm text-[#999999]">
                                        {formatDate(selectedMessage.created_at)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id)}
                                    className="p-2 text-[#666666] hover:text-[#E60000] hover:bg-red-50 rounded-[2px] transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-3 mb-6 p-4 bg-[#F4F4F4] rounded-[4px]">
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
                            </div>

                            {/* Message Content */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-sm text-[#1A1A1A] mb-2">
                                    Mensagem
                                </h3>
                                <p className="text-[#666666] whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                <a 
                                    href={`mailto:${selectedMessage.email}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#E60000] text-white rounded-[2px] font-semibold hover:bg-[#CC0000] transition-colors"
                                >
                                    <Mail size={16} />
                                    Responder por Email
                                </a>
                                {selectedMessage.phone && (
                                    <>
                                        <a 
                                            href={`tel:${selectedMessage.phone}`}
                                            className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] text-[#1A1A1A] rounded-[2px] font-semibold hover:border-[#1A1A1A] transition-colors"
                                        >
                                            <Phone size={16} />
                                            Ligar
                                        </a>
                                        <a 
                                            href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-[2px] font-semibold hover:bg-[#1DA851] transition-colors"
                                        >
                                            <ExternalLink size={16} />
                                            WhatsApp
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-[#999999] min-h-[400px]">
                            <div className="text-center">
                                <Mail size={48} className="mx-auto mb-4 opacity-30" />
                                <p>Selecione uma mensagem</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
