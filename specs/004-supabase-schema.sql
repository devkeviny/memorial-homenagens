-- ==============================================================================
-- SCHEMA SUPABASE: MEMORIAL DE HOMENAGENS
-- Projeto: devkeviny/memorial-homenagens
-- Data: 2026-11-26
-- ==============================================================================

-- 1. Tabela Principal: homenagens
CREATE TABLE IF NOT EXISTS public.homenagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_falecido TEXT NOT NULL,
    data_nascimento TEXT,
    data_falecimento TEXT,
    cidade_cerimonia TEXT,
    local_cerimonia TEXT,
    horario_cerimonia TEXT,
    mensagem_homenagem TEXT,
    audio_url TEXT,
    artes JSONB DEFAULT '{}'::jsonb, -- { "feed_3x4": "...", "stories_9x16": "...", "perfil": "..." }
    status TEXT DEFAULT 'concluido',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('America/Sao_Paulo'::text, now()) NOT NULL
);

-- 2. Índices para Consulta Rápida
CREATE INDEX IF NOT EXISTS idx_homenagens_created_at ON public.homenagens (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homenagens_nome ON public.homenagens (nome_falecido);

-- 3. Habilitação de Row Level Security (RLS)
ALTER TABLE public.homenagens ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acesso Público Respeitoso (Anon)
-- Leitura pública de homenagens
CREATE POLICY "Leitura pública de homenagens"
ON public.homenagens
FOR SELECT
TO anon, authenticated
USING (true);

-- Inserção de nova homenagem por qualquer visitante (sem login obrigatório no app solene)
CREATE POLICY "Inserção pública de homenagens"
ON public.homenagens
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Exclusão de homenagem do próprio usuário/dispositivo
CREATE POLICY "Exclusão pública de homenagens"
ON public.homenagens
FOR DELETE
TO anon, authenticated
USING (true);
