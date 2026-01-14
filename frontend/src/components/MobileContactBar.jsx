import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const MobileContactBar = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#E8E8E8] z-50">
            <div className="grid grid-cols-2">
                {/* Phone */}
                <a
                    href="tel:+351919190993"
                    className="flex items-center justify-center gap-2 py-4 text-[#1A1A1A] font-semibold text-sm active:bg-[#F5F5F5] transition-colors"
                >
                    <Phone size={18} />
                    Ligar
                </a>

                {/* WhatsApp */}
                <a
                    href="https://wa.me/351919190993?text=Olá! Gostava de saber mais sobre as viaturas."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-[#E60000] text-white font-semibold text-sm active:bg-[#CC0000] transition-colors"
                >
                    <MessageCircle size={18} />
                    WhatsApp
                </a>
            </div>
        </div>
    );
};
