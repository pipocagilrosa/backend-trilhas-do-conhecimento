# 📋 Changelog - Backend Trilhas do Conhecimento

## [2.1.0] - 2025-08-15

### 🚀 Novas Funcionalidades

#### Sistema Inteligente de Criação de Cursos

- **Nova API de criação de cursos** com suporte a `careerTrackId` + `topicName` + `level`
- **Criação automática de categorias/tópicos** quando não existem
- **Reutilização inteligente** de categorias existentes
- **Compatibilidade total** com sistema legacy usando `categoriesIds`

#### APIs de Busca Avançada

- **GET** `/courses/career/:careerTrackId/topic/:topicName` - Buscar cursos por trilha e tópico
- **GET** `/courses/career/:careerTrackId/grouped-by-topic` - Cursos agrupados por tópico
- **GET** `/career-tracks/topics` - Listar todos os tópicos disponíveis

#### APIs de Trilhas para Usuários Autenticados

- **GET** `/career-tracks/my-enrollments` - Minhas trilhas com detalhes completos
- **GET** `/career-tracks/my-enrollments/summary` - Resumo das minhas trilhas
- **GET** `/career-tracks/my-enrollments/:id` - Detalhes de trilha específica
- **POST** `/career-tracks/enroll` - Inscrição simplificada em trilha

### 🔧 Melhorias Técnicas

#### Correções de Roteamento

- **Reorganização de rotas** para evitar conflitos no Express
- **Rotas específicas antes de genéricas** (ex: `/my-enrollments` antes de `/:id`)
- **Correção de parsing de UUID** em parâmetros de rota

#### Validação e DTOs

- **Novos DTOs** para respostas estruturadas:
  - `AllCategoriesResponseDto`
  - `UserEnrolledCareerTrackResponse`
  - `MyCareerTrackSummaryResponse`
- **Validação aprimorada** com `CareerTrackParamDto`
- **Tratamento de erros** mais robusto com logs detalhados

#### Sistema de Categorias

- **Método inteligente** `findOrCreateCategoryByTopicAndCareer()`
- **Busca otimizada** de categorias por trilha e tópico
- **Prevenção de duplicatas** automática

### 🐛 Correções

#### Problemas de ID Corrigidos

- **Distinção clara** entre `CareerTrack.id` e `CategoryCourse.id`
- **Correção no mapeamento** de cursos para categorias corretas
- **Fix do erro** "categories not found" causado por confusão de IDs

#### Problemas de Autenticação

- **Correção do campo `addedBy`** em cursos criados
- **Validação de token JWT** aprimorada
- **Tratamento de usuário não autenticado** em endpoints protegidos

#### Melhorias de Performance

- **Uso de transações** na criação de cursos
- **Queries otimizadas** com relacionamentos corretos
- **Cache de busca** de categorias existentes

### 📊 Dados e Migrações

#### Payloads CSV Implementados

- **48 cursos** mapeados para trilhas específicas:
  - **16 cursos** para Desenvolvimento Web Full-Stack
  - **16 cursos** para Ciência de Dados e IA
  - **16 cursos** para DevOps e Cloud
- **Tópicos organizados** por nível (Iniciante, Intermediário, Avançado)
- **Dados estruturados** prontos para importação em massa

### 🔐 Segurança

#### Controle de Acesso Aprimorado

- **Role-based access** implementado corretamente
- **Guards JWT** funcionando em todos os endpoints protegidos
- **Validação de propriedade** (usuário só acessa seus próprios dados)

### 📚 Documentação

#### Documentação Completa da API

- **API_DOCUMENTATION.md** - Guia completo para usuários da API
- **DEVELOPER_GUIDE.md** - Exemplos práticos e códigos para desenvolvedores
- **PAYLOADS_CURSOS_CSV.md** - Dados estruturados para importação

---

## [2.0.0] - 2025-08-14

### 🚀 Funcionalidades Base

#### Sistema de Autenticação

- **JWT Authentication** implementado
- **Login endpoint** `/auth/login`
- **Role-based access** (USER, ADMIN)
- **Guards de proteção** em rotas sensíveis

#### Gestão de Usuários

- **Cadastro de usuários** com validação
- **Atualização de perfil**
- **Sistema de reset de senha** com email
- **Frase favorita** como método alternativo de recuperação
- **Inscrição em trilhas de carreira**
- **Gestão de cursos ativos**

#### Sistema de Trilhas de Carreira

- **CRUD completo** de trilhas
- **Sistema de categorias/tópicos**
- **Relacionamento** trilha → categoria → curso
- **APIs de listagem** e busca

#### Sistema de Cursos

- **CRUD completo** de cursos
- **Relacionamento** com categorias
- **Sistema de avaliação**
- **Certificação**
- **Preços e metadados**

### 🛠 Tecnologias Implementadas

- **NestJS** como framework principal
- **TypeORM** para ORM
- **PostgreSQL** como banco de dados
- **JWT** para autenticação
- **Class-validator** para validação
- **Docker** para containerização
- **Swagger** para documentação básica

---

## [1.0.0] - Versão Inicial

### 🎯 Estrutura Base

- **Configuração inicial** do projeto NestJS
- **Estrutura de módulos** organizada
- **Configuração de banco** PostgreSQL
- **Setup de desenvolvimento** com Docker
- **Configurações base** de CORS e validação

---

## 🔮 Próximas Funcionalidades (Roadmap)

### v2.2.0 - Em Planejamento

- [ ] **Sistema de Progresso** de cursos
- [ ] **API de Relatórios** para admins
- [ ] **Notificações** por email
- [ ] **Sistema de Recomendações** inteligente
- [ ] **Paginação** em listas grandes
- [ ] **Cache** para performance
- [ ] **Rate limiting** para segurança

### v2.3.0 - Funcionalidades Avançadas

- [ ] **Sistema de Avaliações** de cursos pelos usuários
- [ ] **Gamificação** com pontos e badges
- [ ] **Integração com LMS** externos
- [ ] **API de Analytics** detalhada
- [ ] **Websockets** para atualizações em tempo real
- [ ] **Sistema de Certificados** digitais

### v3.0.0 - Recursos Corporativos

- [ ] **Multi-tenancy** para empresas
- [ ] **SSO Integration** (LDAP, OAuth)
- [ ] **API de Relatórios** avançados
- [ ] **Dashboard executivo**
- [ ] **Integração com RH** systems
- [ ] **White-label** customization

---

## 🏷️ Tags de Versão

- **🚀 Novas Funcionalidades** - Recursos completamente novos
- **🔧 Melhorias** - Aprimoramentos em funcionalidades existentes
- **🐛 Correções** - Bug fixes e correções
- **📊 Dados** - Mudanças em estrutura de dados ou migrações
- **🔐 Segurança** - Melhorias relacionadas à segurança
- **📚 Documentação** - Atualizações na documentação
- **⚠️ Breaking Changes** - Mudanças que quebram compatibilidade

---

## 📋 Notas de Migração

### De v1.x para v2.x

- **Não há breaking changes** significativas
- **Novos endpoints** são aditivos
- **Banco de dados** é compatível
- **Configurações** mantidas

### De v2.0.x para v2.1.x

- **Total compatibilidade** com versões anteriores
- **Novos endpoints** não afetam existentes
- **Método antigo** de criação de cursos continua funcionando
- **Sem necessidade** de migração de dados

---

## 🤝 Contribuições

Contribuições foram implementadas por:

- **Backend Development** - Estrutura principal da API
- **System Design** - Arquitetura de trilhas e cursos
- **Data Modeling** - Relacionamentos e validações
- **API Documentation** - Documentação completa
- **CSV Integration** - Mapeamento de dados externos

---

Para detalhes técnicos completos, consulte:

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Developer Guide](./docs/DEVELOPER_GUIDE.md)
- [CSV Payloads](./docs/PAYLOADS_CURSOS_CSV.md)
