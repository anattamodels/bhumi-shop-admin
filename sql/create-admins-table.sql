-- =============================================================================
-- SISTEMA DE AUTENTICAÇÃO ADMIN - BHUMI SHOP
-- Execute todo este arquivo de uma vez no Supabase SQL Editor
-- =============================================================================

-- Habilitar extensão pgcrypto para hashing de senhas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nome TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Remover política existente se houver
DROP POLICY IF EXISTS "Admins podem ser gerenciados" ON admins;

-- Política: permite apenas operações via functions com verificação
CREATE POLICY "Admins podem ser gerenciados" ON admins
  FOR ALL TO anon USING (false) WITH CHECK (false);

-- =============================================================================
-- FUNÇÕES
-- =============================================================================

-- Função para verificar senha usando bcrypt (via pgcrypto)
CREATE OR REPLACE FUNCTION verify_admin_password(p_email TEXT, p_password TEXT)
RETURNS JSONB AS $$
DECLARE
  v_admin RECORD;
BEGIN
  SELECT * INTO v_admin 
  FROM admins 
  WHERE email = LOWER(p_email);
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Admin não encontrado');
  END IF;
  
  IF v_admin.password_hash = crypt(p_password, v_admin.password_hash) THEN
    RETURN jsonb_build_object(
      'valid', true,
      'admin', jsonb_build_object(
        'id', v_admin.id,
        'email', v_admin.email,
        'nome', v_admin.nome
      )
    );
  ELSE
    RETURN jsonb_build_object('valid', false, 'error', 'Senha incorreta');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar hash de senha
CREATE OR REPLACE FUNCTION hash_password(p_password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(p_password, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar novo admin
CREATE OR REPLACE FUNCTION create_admin(p_email TEXT, p_password TEXT, p_nome TEXT DEFAULT 'Administrador')
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO admins (email, password_hash, nome)
  VALUES (LOWER(p_email), hash_password(p_password), p_nome)
  ON CONFLICT (email) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- CRIAR ADMINISTRADOR
-- =============================================================================
-- Execute esta linha para criar seu usuário admin:
-- Substitua os valores abaixo pelo seu email e senha desejados

SELECT create_admin('bhumishop.adm@gmail.com', 'AryaTara21', 'Administrador');

-- =============================================================================
-- VERIFICAR
-- Execute para confirmar que o admin foi criado:
-- SELECT * FROM admins;
