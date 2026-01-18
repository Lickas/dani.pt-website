
import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';
import { Loader2, ArrowRight, Mail } from 'lucide-react';

export const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email, is_active: true }]);

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast.info('Este email já está subscrito.');
                } else {
                    throw error;
                }
            } else {
                toast.success('Subscrição efetuada com sucesso!');
                setEmail('');
            }
        } catch (error) {
            console.error('Newsletter error details:', error);
            // Show more specific error message if available
            const errorMessage = error.message || 'Erro ao subscrever. Tente novamente.';
            toast.error(`Erro: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-white dark:bg-[#111] border-t border-gray-100 dark:border-[#222]">
            <div className="container-site py-16 md:py-20">
                <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-sm p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative pattern */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Mail size={120} />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto text-center">
                        <h2 className="font-display text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
                            Fique a par das <span className="text-[#E60000]">novidades</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
                            Receba em primeira mão as nossas novas entradas de viaturas e campanhas exclusivas. 
                            Sem spam, apenas o que importa.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="O seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 px-5 py-3.5 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-sm text-sm outline-none focus:border-[#E60000] dark:focus:border-[#E60000] transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3.5 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium text-sm rounded-sm transition-colors flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>A guardar...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Subscrever</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                            Pode cancelar a subscrição a qualquer momento.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
