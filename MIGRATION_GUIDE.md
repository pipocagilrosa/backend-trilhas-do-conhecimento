# Problema com a Coluna `favorite` Desaparecendo

## 🔴 Problema Identificado

A coluna `favorite` da tabela `user_course` estava desaparecendo toda vez que o sistema era reiniciado.

### Causa Raiz

O problema estava na configuração do TypeORM com `synchronize: true`:

```typescript
synchronize: true; // ❌ PERIGOSO - recria o schema a cada reinicialização
```

Quando `synchronize` está habilitado, o TypeORM:

1. **Dropa e recria** as tabelas baseado nas entidades
2. **Perde dados** que foram adicionados manualmente no banco
3. **Ignora** mudanças feitas diretamente no banco de dados
4. **NÃO é recomendado** para produção

## ✅ Solução Implementada

### 1. Desabilitado `synchronize`

```typescript
// src/config/typeorm.config.ts
synchronize: false; // ✅ Seguro - usa migrations
migrationsRun: true; // ✅ Executa migrations automaticamente
```

### 2. Criada Migration para `favorite`

Arquivo: `src/migrations/1733788800000-AddFavoriteColumnToUserCourse.ts`

Esta migration:

- ✅ Verifica se a coluna já existe antes de criar
- ✅ Adiciona a coluna `favorite` com valor padrão `false`
- ✅ Permite rollback seguro

### 3. Scripts Disponíveis

```bash
# Ver migrations executadas
npm run migration:show

# Executar migrations pendentes
npm run migration:run

# Reverter última migration
npm run migration:revert

# Gerar nova migration automaticamente
npm run migration:generate -- -n NomeDaMigration

# Criar migration vazia
npm run migration:create -- -n NomeDaMigration
```

## 🚀 Como Usar Migrations Daqui em Diante

### Para Adicionar/Modificar Colunas

1. **Modifique a entidade** (ex: adicionar novo campo)
2. **Gere a migration**:
   ```bash
   npm run migration:generate -- -n AddNovaColuna
   ```
3. **Execute a migration**:
   ```bash
   npm run migration:run
   ```

### Exemplo: Adicionar Nova Coluna

```typescript
// 1. Adicione na entidade
@Column({ default: false })
isPublic: boolean;

// 2. Gere migration
npm run migration:generate -- -n AddIsPublicToUserCourse

// 3. A migration será criada automaticamente
```

## 📋 Boas Práticas

✅ **NUNCA** usar `synchronize: true` em produção  
✅ **SEMPRE** usar migrations para mudanças no schema  
✅ **TESTAR** migrations em ambiente de dev primeiro  
✅ **COMMITAR** as migrations no repositório  
✅ **DOCUMENTAR** mudanças complexas nas migrations

## 🔧 Troubleshooting

### Se a coluna `favorite` ainda não existe:

```bash
# Execute a migration manualmente
npm run migration:run
```

### Se houver erro de coluna duplicada:

A migration já verifica se a coluna existe. Se mesmo assim der erro, rode:

```sql
-- Verifique no banco
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'user_course';

-- Se a coluna não existir, adicione manualmente
ALTER TABLE user_course
ADD COLUMN favorite boolean DEFAULT false NOT NULL;
```

## 📊 Estado Atual

- ✅ `synchronize: false` (seguro)
- ✅ `migrationsRun: true` (automático no startup)
- ✅ Migration criada para `favorite`
- ✅ Entidade `UserCourse` tem o campo `favorite`
- ✅ Scripts de migration configurados
