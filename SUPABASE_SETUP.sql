-- =========================================
-- SUPABASE SETUP - dANI.PT Stand Automóvel
-- =========================================
-- Execute este SQL no Supabase SQL Editor
-- Dashboard > SQL Editor > New Query

-- =========================================
-- 1. CRIAR TABELAS
-- =========================================

-- Tabela de Viaturas
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    mileage INTEGER DEFAULT 0,
    fuel_type VARCHAR(50) DEFAULT 'Gasolina',
    transmission VARCHAR(50) DEFAULT 'Manual',
    color VARCHAR(50),
    power VARCHAR(50),
    description TEXT,
    features JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT false,
    is_sold BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Campanhas (com múltiplos tipos de promoção)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) DEFAULT 'percentage',  -- percentage, fixed_value, trade_in, financing, free_service, extended_warranty, gift, bundle, other
    discount_percentage DECIMAL(5,2),
    discount_value DECIMAL(10,2),
    benefit_description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    terms_conditions TEXT,
    applicable_vehicle_ids JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Contactos
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'new',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(200) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Informações do Negócio
CREATE TABLE IF NOT EXISTS business_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    phone VARCHAR(50),
    email VARCHAR(200),
    address TEXT,
    whatsapp VARCHAR(50),
    about_text TEXT,
    google_maps_embed TEXT,
    schedule JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- 2. CRIAR ÍNDICES
-- =========================================

CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_featured ON vehicles(is_featured);
CREATE INDEX IF NOT EXISTS idx_vehicles_is_sold ON vehicles(is_sold);
CREATE INDEX IF NOT EXISTS idx_campaigns_is_active ON campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts(is_read);

-- =========================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- =========================================

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;

-- =========================================
-- 4. POLÍTICAS DE ACESSO (RLS POLICIES)
-- =========================================

-- Vehicles: Leitura pública, escrita apenas para autenticados
CREATE POLICY "Vehicles are viewable by everyone" ON vehicles
    FOR SELECT USING (true);

CREATE POLICY "Vehicles are editable by authenticated users" ON vehicles
    FOR ALL USING (auth.role() = 'authenticated');

-- Campaigns: Leitura pública, escrita apenas para autenticados
CREATE POLICY "Campaigns are viewable by everyone" ON campaigns
    FOR SELECT USING (true);

CREATE POLICY "Campaigns are editable by authenticated users" ON campaigns
    FOR ALL USING (auth.role() = 'authenticated');

-- Contacts: Criação pública, leitura/escrita para autenticados
CREATE POLICY "Anyone can create contacts" ON contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contacts are viewable by authenticated users" ON contacts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Contacts are editable by authenticated users" ON contacts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Contacts are deletable by authenticated users" ON contacts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Newsletter: Subscrição pública, leitura/escrita para autenticados
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Newsletter is viewable by authenticated users" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Newsletter is editable by authenticated users" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');

-- Business Info: Leitura pública, escrita para autenticados
CREATE POLICY "Business info is viewable by everyone" ON business_info
    FOR SELECT USING (true);

CREATE POLICY "Business info is editable by authenticated users" ON business_info
    FOR ALL USING (auth.role() = 'authenticated');

-- =========================================
-- 5. CRIAR STORAGE BUCKETS
-- =========================================
-- NOTA: Executar isto no Supabase Dashboard > Storage
-- Ou usar a API de Storage

-- Criar buckets (fazer via Dashboard):
-- 1. vehicle-images (público)
-- 2. campaign-images (público)

-- =========================================
-- 6. DADOS DE TESTE
-- =========================================

-- Limpar dados existentes (opcional - comentar se não quiser)
-- DELETE FROM vehicles;
-- DELETE FROM campaigns;

-- Inserir Viaturas de Teste (com marcas do stand)
INSERT INTO vehicles (brand, model, year, price, mileage, fuel_type, transmission, color, power, description, features, images, is_featured, is_sold)
VALUES 
('FIAT', '500', 2022, 18500, 25000, 'Gasolina', 'Manual', 'Branco', '70cv', 'FIAT 500 em excelente estado. Ideal para cidade.', '["Ar Condicionado", "Bluetooth", "Cruise Control", "Sensores Estacionamento"]', '["https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"]', true, false),

('PEUGEOT', '208', 2023, 22000, 15000, 'Gasolina', 'Automático', 'Cinzento', '100cv', 'PEUGEOT 208 novo modelo. i-Cockpit de série.', '["i-Cockpit", "Apple CarPlay", "Android Auto", "LED", "Câmara Traseira"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', true, false),

('CITROËN', 'C3', 2021, 16500, 35000, 'Gasolina', 'Manual', 'Vermelho', '83cv', 'CITROËN C3 confortável e económico. Design único.', '["Airbump", "Ecrã Tátil 7\"", "Ar Condicionado", "USB"]', '["https://images.unsplash.com/photo-1603386329225-868f9b1ee6b9?w=800"]', false, false),

('HYUNDAI', 'i20', 2022, 19500, 20000, 'Híbrido', 'Automático', 'Azul', '100cv', 'HYUNDAI i20 Hybrid. Consumos muito baixos.', '["Híbrido 48V", "Cruise Adaptativo", "Lane Assist", "Ecrã 10.25\""]', '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]', true, false),

('KIA', 'Sportage', 2023, 35000, 10000, 'Híbrido Plug-in', 'Automático', 'Preto', '265cv', 'KIA Sportage PHEV. 7 anos de garantia.', '["PHEV", "Tração Integral", "Teto Panorâmico", "Harman Kardon", "Head-Up Display"]', '["https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800"]', true, false),

('JEEP', 'Renegade', 2021, 28000, 30000, 'Diesel', 'Automático', 'Verde', '130cv', 'JEEP Renegade Limited. Perfeito para aventura.', '["4x4", "Uconnect 8.4\"", "Bancos Aquecidos", "Jantes 18\""]', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', false, false),

('OPEL', 'Corsa-e', 2023, 32000, 8000, 'Elétrico', 'Automático', 'Branco', '136cv', 'OPEL Corsa-e 100% elétrico. Autonomia 359km.', '["100% Elétrico", "Carregamento Rápido", "Navi Pro", "Intellilux LED"]', '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"]', false, false),

('ALFA ROMEO', 'Tonale', 2024, 45000, 5000, 'Híbrido Plug-in', 'Automático', 'Vermelho', '275cv', 'ALFA ROMEO Tonale PHEV. Design italiano premium.', '["PHEV Q4", "DNA Driving Mode", "Harman Kardon", "19\" Wheels", "Adaptive Suspension"]', '["https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"]', true, false),

('DS AUTOMOBILES', 'DS 3', 2022, 29000, 18000, 'Gasolina', 'Automático', 'Preto', '130cv', 'DS 3 Crossback. Luxo francês acessível.', '["DS Matrix LED", "DS Park Pilot", "Nappa Leather", "Focal Electra"]', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"]', false, false),

('BYD', 'Atto 3', 2024, 38000, 2000, 'Elétrico', 'Automático', 'Azul', '204cv', 'BYD Atto 3. SUV elétrico com grande autonomia (420km).', '["Blade Battery", "V2L", "Rotating Screen", "Heat Pump", "OTA Updates"]', '["https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800"]', true, false);

-- Inserir Campanhas de Teste (com diferentes tipos)
INSERT INTO campaigns (title, description, campaign_type, discount_percentage, discount_value, benefit_description, start_date, end_date, is_active, image_url, terms_conditions)
VALUES 
('Verão em Força', 'Descontos até 15% em viaturas selecionadas. Aproveite para renovar o seu carro antes das férias!', 'percentage', 15, NULL, NULL, '2025-06-01', '2025-08-31', true, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800', 'Válido para viaturas em stock. Não acumulável com outras promoções.'),

('Bónus Retoma Especial', 'Traga o seu carro usado e receba um bónus extra de 2000€ na retoma!', 'trade_in', NULL, 2000, NULL, '2025-05-01', '2025-12-31', true, 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800', 'Válido para viaturas até 10 anos. Sujeito a avaliação.'),

('Financiamento 0%', 'Taxa 0% nos primeiros 24 meses em todos os modelos elétricos e híbridos plug-in.', 'financing', NULL, NULL, 'TAEG 0% nos primeiros 24 meses. Entrada mínima de 20%.', '2025-01-01', '2025-06-30', true, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 'Sujeito a aprovação de crédito. Consulte condições em loja.'),

('Pack Inverno Grátis', 'Na compra de qualquer SUV, oferecemos o Pack Inverno completo!', 'gift', NULL, NULL, 'Pack Inverno inclui: 4 pneus de inverno, tapetes de borracha e kit de emergência.', '2025-10-01', '2025-12-31', false, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'Válido para SUVs novos em stock.'),

('Garantia +3 Anos', 'Compre agora e receba 3 anos de garantia adicional gratuitamente!', 'extended_warranty', NULL, NULL, 'Garantia total de 5 anos ou 150.000km em todas as viaturas usadas.', '2025-01-01', '2025-03-31', true, NULL, 'Não aplicável a viaturas com mais de 100.000km.');

-- Inserir Info do Negócio
INSERT INTO business_info (id, phone, email, address, whatsapp, schedule)
VALUES (
    1,
    '+351 919 190 993',
    'daniel.henriques@dani.pt',
    'Rua da Casa Meada 12, Antanhol, 3040-584 Coimbra',
    '+351919190993',
    '{"segunda": {"open": "09:00", "close": "20:00"}, "terca": {"open": "09:00", "close": "20:00"}, "quarta": {"open": "09:00", "close": "20:00"}, "quinta": {"open": "09:00", "close": "20:00"}, "sexta": {"open": "09:00", "close": "20:00"}, "sabado": {"open": "09:00", "close": "20:00"}, "domingo": {"open": "", "close": ""}}'
) ON CONFLICT (id) DO UPDATE SET
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    whatsapp = EXCLUDED.whatsapp,
    schedule = EXCLUDED.schedule;

-- =========================================
-- 7. CRIAR UTILIZADOR ADMIN
-- =========================================
-- NOTA: Criar utilizador via Supabase Dashboard
-- Authentication > Users > Add User
-- Email: admin@dani.pt
-- Password: admin123
-- =========================================

SELECT 'Setup completo! Agora cria um utilizador admin no Supabase Dashboard.' AS status;
