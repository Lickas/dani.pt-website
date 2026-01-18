-- COPIE E COLE ESTE CÓDIGO NO SQL EDITOR DO SUPABASE DASHBOARD
-- Link: https://supabase.com/dashboard/project/_/sql/new

-- 1. Criar a tabela de subscritores
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Ativar segurança (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 3. Limpar políticas antigas se existirem (para evitar erros de duplicados)
DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON newsletter_subscribers;

-- 4. Criar Política: Qualquer pessoa (anónima) pode INSERIR o seu email
CREATE POLICY "Public can subscribe" 
ON newsletter_subscribers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 5. Criar Política: Apenas Admins (autenticados) podem VER a lista
CREATE POLICY "Admins can view subscribers" 
ON newsletter_subscribers 
FOR SELECT 
TO authenticated 
USING (true);

-- 6. Criar Política: Apenas Admins (autenticados) podem APAGAR
CREATE POLICY "Admins can delete subscribers" 
ON newsletter_subscribers 
FOR DELETE 
TO authenticated 
USING (true);
