import React from 'react';

const brands = [
    { name: 'Abarth', src: '/marcas/abarth.png' },
    { name: 'Alfa Romeo', src: '/marcas/alfa-romeo.png' },
    { name: 'BYD', src: '/marcas/byd.png' },
    { name: 'Citroën', src: '/marcas/citroen.png' },
    { name: 'DS Automobiles', src: '/marcas/ds-automobiles.png' },
    { name: 'Fiat Professional', src: '/marcas/fiar-professional.png' },
    { name: 'Fiat', src: '/marcas/fiat.png' },
    { name: 'Fuso', src: '/marcas/fuso.png' },
    { name: 'Hyundai', src: '/marcas/hyundai.png' },
    { name: 'Isuzu', src: '/marcas/isuzu.png' },
    { name: 'Jeep', src: '/marcas/jeep.png' },
    { name: 'KGM', src: '/marcas/kgm.png' },
    { name: 'Kia', src: '/marcas/kia.png' },
    { name: 'Maxus', src: '/marcas/maxus.png' },
    { name: 'Mitsubishi', src: '/marcas/mitsubishi.png' },
    { name: 'Opel', src: '/marcas/opel.png' },
    { name: 'Peugeot', src: '/marcas/peugeot.png' },
];

export const BrandMarquee = () => {
    return (
        <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 overflow-hidden">
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
            
            {/* AJUSTE FINAL: 
                Usei mb-12 (3rem / 48px). 
                Isto é o dobro do que tinhas no início, mas metade do buraco gigante de agora.
            */}
            <div className="container-site mb-12">
                <p className="text-center text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                    Marcas que comercializo
                </p>
            </div>

            {/* Removi a DIV espaçadora gigante daqui */}

            <div className="flex w-full overflow-hidden mask-gradient-x">
                <div className="flex items-center gap-8 md:gap-12 animate-marquee whitespace-nowrap px-4">
                    {/* First set of logos */}
                    {brands.map((brand, index) => (
                        <div 
                            key={`brand-1-${index}`} 
                            className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0"
                        >
                            <img 
                                src={brand.src} 
                                alt={brand.name} 
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </div>
                    ))}
                    
                    {/* Second set of logos (duplicate) */}
                    {brands.map((brand, index) => (
                        <div 
                            key={`brand-2-${index}`} 
                            className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 dark:brightness-0 dark:invert dark:hover:brightness-100 dark:hover:invert-0"
                        >
                            <img 
                                src={brand.src} 
                                alt={brand.name} 
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
