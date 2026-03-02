-- =============================================================================
-- INSTRUÇÕES PARA CONFIGURAR ADMIN COM BCRYPT
-- =============================================================================

-- Execute este SQL no Supabase SQL Editor para configurar o sistema de autenticação
-- com hashing de senhas usando bcrypt (via pgcrypto).

-- =============================================================================
-- PASSO 1: Execute todo o conteúdo do arquivo create-admins-table.sql
-- =============================================================================

-- Depois de executar, rode este comando para criar seu admin:

SELECT create_admin('SEU_EMAIL@exemplo.com', 'SUA_SENHA_AQUI', 'Administrador');

-- =============================================================================
-- EXEMPLO para criar o admin:
-- =============================================================================

SELECT create_admin('admin@bhumi.com.br', 'MinhaSenha123@', 'Administrador');

-- =============================================================================
-- VERIFICAR se o admin foi criado:
-- =============================================================================

SELECT id, email, nome, created_at FROM admins;

-- A senha estará com hash bcrypt, algo como:
-- $2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

-- =============================================================================
-- TESTAR LOGIN (via SQL):
-- =============================================================================

SELECT verify_admin_password('admin@bhumi.com.br', 'MinhaSenha123@');

-- Retorna: {"valid":true,"admin": {...}}

-- Se a senha estiver errada:
SELECT verify_admin_password('admin@bhumi.com.br', 'senha errada');

-- Retorna: {"valid":false,"error":"Senha incorreta"}
