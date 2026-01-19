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

-- Tabela de Campanhas
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2),
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

-- Inserir Viaturas de Teste
INSERT INTO vehicles (brand, model, year, price, mileage, fuel_type, transmission, color, power, description, features, images, is_featured, is_sold)
VALUES 
('BMW', '320d', 2020, 28500, 45000, 'Diesel', 'Automático', 'Preto', '190cv', 'BMW 320d em excelente estado. Revisões em dia, único dono.', '["GPS", "Cruise Control", "Sensores Estacionamento", "Bluetooth", "Bancos Aquecidos"]', '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800", "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"]', true, false),

('Mercedes-Benz', 'Classe A 180', 2021, 32000, 25000, 'Gasolina', 'Automático', 'Branco', '136cv', 'Mercedes Classe A como novo. Garantia de fábrica até 2026.', '["MBUX", "LED", "Keyless", "Câmara Traseira", "Apple CarPlay"]', '["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800", "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"]', true, false),

('Tesla', 'Model 3', 2022, 45000, 15000, 'Elétrico', 'Automático', 'Azul', '283cv', 'Tesla Model 3 Standard Range Plus. Autopilot incluído.', '["Autopilot", "Supercharger", "Vidros Panorâmicos", "App Mobile", "Premium Audio"]', '["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800", "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800"]', true, false),

('Audi', 'A4 Avant', 2019, 26500, 60000, 'Diesel', 'Automático', 'Cinzento', '150cv', 'Audi A4 Avant impecável. Full extras.', '["Virtual Cockpit", "Matrix LED", "Bang & Olufsen", "Teto Panorâmico"]', '["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"]', false, false),

('Volkswagen', 'Golf GTI', 2020, 29000, 35000, 'Gasolina', 'Manual', 'Vermelho', '245cv', 'Golf GTI Mk8. Performance Pack.', '["DCC", "Diff. Eletrónico", "Bancos Desportivos", "Escape Desportivo"]', '["https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800"]', false, false),

('Peugeot', '3008 GT', 2021, 31000, 28000, 'Híbrido', 'Automático', 'Preto', '300cv', 'Peugeot 3008 Hybrid4. 4x4, 300cv.', '["i-Cockpit", "Focal", "Massagem", "Night Vision"]', '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"]', false, false),

('Toyota', 'Corolla Hybrid', 2022, 27500, 18000, 'Híbrido', 'CVT', 'Prata', '122cv', 'Toyota Corolla Hybrid. Consumos de 4L/100km.', '["Toyota Safety Sense", "JBL", "Head-Up Display", "Carregador Wireless"]', '["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"]', false, false),

('Renault', 'Clio RS Line', 2021, 18500, 22000, 'Gasolina', 'Manual', 'Branco', '130cv', 'Renault Clio RS Line. Pack desportivo completo.', '["Easy Link", "Jantes 17", "LED", "Cruise Adaptativo"]', '["https://images.unsplash.com/photo-1603386329225-868f9b1ee6b9?w=800"]', false, false);

-- Inserir Campanhas de Teste
INSERT INTO campaigns (title, description, discount_percentage, start_date, end_date, is_active, image_url)
VALUES 
('Verão em Força', 'Descontos até 15% em carros selecionados. Aproveite para renovar o seu carro antes das férias!', 15, '2025-06-01', '2025-08-31', true, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'),

('Elétricos com Vantagem', 'Transição para elétrico nunca foi tão fácil. Financiamento com taxa 0% nos primeiros 12 meses.', 10, '2025-05-01', '2025-12-31', true, 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800');

-- Inserir Info do Negócio
INSERT INTO business_info (id, phone, email, address, whatsapp, schedule)
VALUES (
    1,
    '+351 919 190 993',
    'daniel.henriques@dani.pt',
    'Rua da Casa Meada 12, Antanhol, 3040-584 Coimbra',
    '+351919190993',
    '{"segunda": {"open": "09:00", "close": "19:00"}, "terca": {"open": "09:00", "close": "19:00"}, "quarta": {"open": "09:00", "close": "19:00"}, "quinta": {"open": "09:00", "close": "19:00"}, "sexta": {"open": "09:00", "close": "19:00"}, "sabado": {"open": "09:00", "close": "13:00"}, "domingo": {"open": "", "close": ""}}'
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
