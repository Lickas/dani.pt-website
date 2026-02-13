-- Tabela de Renting (Ofertas de Aluguer de Longa Duração)
CREATE TABLE IF NOT EXISTS renting_offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(200),
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    features JSONB DEFAULT '[]', -- Lista de serviços incluídos (ex: ["Seguro", "Manutenção"])
    technical_details JSONB DEFAULT '{}', -- Detalhes técnicos (ex: {"Combustível": "Gasolina", "Caixa": "Manual"})
    pricing_matrix JSONB DEFAULT '[]', -- Matriz de preços (ex: [{"duration": 48, "mileage": 10000, "upfront": 0, "price": 279}])
    category VARCHAR(50) DEFAULT 'private', -- 'private', 'business', 'both'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE renting_offers ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
CREATE POLICY "Renting offers are viewable by everyone" ON renting_offers
    FOR SELECT USING (true);

CREATE POLICY "Renting offers are editable by authenticated users" ON renting_offers
    FOR ALL USING (auth.role() = 'authenticated');

-- Dados de Exemplo (Baseado no prompt do utilizador)
INSERT INTO renting_offers (title, subtitle, description, image_url, category, features, technical_details, pricing_matrix)
VALUES (
    'Opel Corsa 1.2 100cv GS',
    'Aluguer de longa duração - Tudo incluído',
    'Renda mensal com tudo incluído. Sem preocupações. Promo Olímpica. Para empresas e particulares.',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', -- Exemplo de imagem
    'private',
    '[
        "Seguro Responsabilidade Civil 50.000.000 e Danos Próprios com franquia 4%",
        "Quebra Isolada de Vidros",
        "Manutenção Programada, Desgaste e Avarias",
        "Assistência em viagem",
        "Veículo de substituição",
        "Pneus Ilimitados",
        "IUC (Imposto Único de Circulação)",
        "IPO (Inspeção Periódica Obrigatória)",
        "Gestão de Sinistros",
        "Apoio ao condutor 24H"
    ]',
    '{
        "Marca": "Opel",
        "Modelo": "Corsa",
        "Motor": "1.2 Turbo",
        "Potência": "100cv",
        "Versão": "GS",
        "Combustível": "Gasolina",
        "Transmissão": "Manual"
    }',
    '[
        {"duration": 48, "mileage": 10000, "upfront": 0, "price": 279},
        {"duration": 36, "mileage": 10000, "upfront": 0, "price": 310},
        {"duration": 60, "mileage": 10000, "upfront": 0, "price": 265},
        {"duration": 48, "mileage": 15000, "upfront": 0, "price": 295},
        {"duration": 36, "mileage": 15000, "upfront": 0, "price": 325},
        {"duration": 60, "mileage": 15000, "upfront": 0, "price": 280},
        {"duration": 48, "mileage": 20000, "upfront": 0, "price": 310},
        {"duration": 36, "mileage": 20000, "upfront": 0, "price": 340},
        {"duration": 60, "mileage": 20000, "upfront": 0, "price": 295}
    ]'
);

SELECT 'Tabela renting_offers criada com sucesso!' AS status;
