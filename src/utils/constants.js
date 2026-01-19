/**
 * Constantes partilhadas - dANI.PT
 * Marcas, tipos de combustível, tipos de campanha, etc.
 */

// Marcas disponíveis no stand (ordenadas alfabeticamente)
export const BRANDS = [
    'ABARTH',
    'ALFA ROMEO',
    'BYD',
    'CITROËN',
    'DS AUTOMOBILES',
    'FIAT',
    'FIAT PROFESSIONAL',
    'FUSO',
    'HYUNDAI',
    'ISUZU',
    'JEEP',
    'KGM',
    'KIA',
    'MAXUS',
    'MITSUBISHI MOTORS',
    'OPEL',
    'PEUGEOT'
];

// Tipos de combustível
export const FUEL_TYPES = [
    'Gasolina',
    'Diesel',
    'Híbrido',
    'Híbrido Plug-in',
    'Elétrico',
    'GPL',
    'GNC'
];

// Tipos de transmissão
export const TRANSMISSIONS = [
    'Manual',
    'Automático',
    'Semi-Automático',
    'CVT'
];

// Tipos de campanha/promoção
export const CAMPAIGN_TYPES = [
    { value: 'percentage', label: 'Desconto em Percentagem (%)', icon: '%' },
    { value: 'fixed_value', label: 'Desconto em Valor Fixo (€)', icon: '€' },
    { value: 'trade_in', label: 'Bónus Retoma', icon: '🚗' },
    { value: 'financing', label: 'Condições de Financiamento', icon: '💳' },
    { value: 'free_service', label: 'Serviço Grátis Incluído', icon: '🔧' },
    { value: 'extended_warranty', label: 'Garantia Estendida', icon: '🛡️' },
    { value: 'gift', label: 'Oferta/Brinde', icon: '🎁' },
    { value: 'bundle', label: 'Pack Promocional', icon: '📦' },
    { value: 'other', label: 'Outro', icon: '⭐' }
];

// Anos disponíveis para filtros (15 anos)
export const getYears = (count = 15) => {
    return Array.from({ length: count }, (_, i) => new Date().getFullYear() - i);
};

// Anos para seleção de viatura (30 anos)
export const getVehicleYears = (count = 30) => {
    return Array.from({ length: count }, (_, i) => new Date().getFullYear() - i);
};

// Ranges de preço para filtros
export const PRICE_RANGES = [
    { label: 'Até 10.000€', min: 0, max: 10000 },
    { label: '10.000€ - 20.000€', min: 10000, max: 20000 },
    { label: '20.000€ - 30.000€', min: 20000, max: 30000 },
    { label: '30.000€ - 40.000€', min: 30000, max: 40000 },
    { label: '40.000€ - 50.000€', min: 40000, max: 50000 },
    { label: 'Mais de 50.000€', min: 50000, max: null }
];
