import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const MobileContactBar = () => {
    const phoneNumber = '+351919190993';
    const whatsappNumber = '351919190993';
    const whatsappMessage = encodeURIComponent('Olá! Estou interessado em saber mais sobre as viaturas disponíveis na dANI.PT');

    return (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#E5E5E5] z-50">
            <div className="grid grid-cols-2 divide-x divide-[#E5E5E5]">
                {/* Phone */}
                <a
                    href={`tel:${phoneNumber}`}
                    className="flex items-center justify-center gap-2 py-4 text-[#1A1A1A] active:bg-[#F4F4F4] transition-colors"
                    data-testid="mobile-phone-cta"
                >
                    <Phone size={20} />
                    <span className="font-inter font-semibold text-sm">Ligar</span>
                </a>

                {/* WhatsApp */}
                <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white active:bg-[#1DA851] transition-colors"
                    data-testid="mobile-whatsapp-cta"
                >
                    <MessageCircle size={20} />
                    <span className="font-inter font-semibold text-sm">WhatsApp</span>
                </a>
            </div>
        </div>
    );
};
