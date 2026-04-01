# 📚 Backend - Trilhas do Conhecimento

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

## 📋 Descrição

API REST completa para gerenciamento de **Trilhas de Conhecimento**, desenvolvida com **NestJS** e **TypeScript**. O sistema permite a criação e gestão de trilhas de carreira, cursos, categorias e usuários, com sistema de autenticação JWT e controle de acesso baseado em roles.

### 🎯 Funcionalidades Principais

- 🔐 **Autenticação JWT** com roles (USER/ADMIN)
- 👤 **Gestão completa de usuários** com sistema de recuperação de senha
- 🎯 **Trilhas de carreira** organizadas por tópicos e níveis
- 📖 **Sistema inteligente de cursos** com criação automática de categorias
- 📊 **APIs avançadas** de busca e filtragem
- 🏢 **Sistema de inscrições** e acompanhamento de progresso
- 📧 **Notificações por email** para recuperação de senha
- 🐳 **Containerização** com Docker e Docker Compose

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18+
- **Docker** e **Docker Compose**
- **PostgreSQL** (ou use o container Docker)

### 🐳 Executar com Docker (Recomendado)

```bash
# Clonar o repositório
git clone <repository-url>
cd backend-trilhas-do-conhecimento

# Executar com docker-compose
docker-compose up -d

# A API estará disponível em https://trilhaconhecimento-jakltgda.b4a.run
```

### 🔧 Executar Localmente

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executar migrações do banco
npm run migration:run

# Executar em modo de desenvolvimento
npm run start:dev

# Executar em modo de produção
npm run start:prod
```

## 📚 Documentação

### 📖 Documentação da API

- **[API Documentation](./API_DOCUMENTATION.md)** - Guia completo de todos os endpoints
- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Exemplos práticos e códigos para desenvolvedores
- **[Changelog](./CHANGELOG.md)** - Histórico de versões e mudanças

### 🎯 Payloads de Exemplo

- **[CSV Payloads](./PAYLOADS_CURSOS_CSV.md)** - Dados estruturados para importação de cursos

### 🌐 Base URL

```
https://trilhaconhecimento-jakltgda.b4a.run
```

## 🏗️ Arquitetura

### 📁 Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── guards/          # Guards JWT e Roles
│   ├── strategies/      # Estratégias Passport
│   └── dto/            # DTOs de autenticação
├── users/               # Módulo de usuários
│   ├── entity/         # Entidades TypeORM
│   ├── dto/           # DTOs de entrada/saída
│   └── users.service.ts
├── courses/             # Módulo de cursos e trilhas
│   ├── entity/         # Entidades (Course, CareerTrack, CategoryCourse)
│   ├── dto/           # DTOs especializados
│   ├── courses.service.ts
│   └── career-track.service.ts
└── config/              # Configurações (DB, CORS, etc)
```

### 🔄 Fluxo de Dados

```
Client Request → Guards (JWT/Roles) → Controller → Service → Repository → Database
                      ↓
Response ← DTO Transformation ← Business Logic ← Data Processing ← Query Results
```

### 🎯 Relacionamentos Principais

```
User ←→ UserCareerTrack ←→ CareerTrack
                            ↓
                       CategoryCourse (Tópicos)
                            ↓
                         Course
                            ↓
                       UserCourse (Progresso)
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔑 Principais Endpoints

### 🔐 Autenticação

- `POST /auth/login` - Login e obtenção do token JWT
- `POST /auth/logout` - Logout do usuário autenticado

### 👤 Usuários

- `POST /user/signup` - Cadastro de usuário
- `GET /user/:id/profile` - Perfil do usuário
- `PUT /user/:id/profile-update` - Atualizar perfil
- `POST /user/reset-password` - Solicitar reset de senha

### 🎯 Trilhas de Carreira

- `GET /career-tracks` - Listar todas as trilhas
- `POST /career-tracks/enroll` - Inscrever-se em trilha
- `GET /career-tracks/my-enrollments` - Minhas trilhas inscritas
- `GET /career-tracks/topics` - Todos os tópicos disponíveis

### 📖 Cursos

- `POST /courses` - Criar curso (Admin)
- `GET /courses` - Listar todos os cursos
- `GET /courses/career/:id/topic/:topic` - Cursos por trilha e tópico
- `GET /courses/career/:id/grouped-by-topic` - Cursos agrupados por tópico

## 💡 Funcionalidades Avançadas

### 🤖 Sistema Inteligente de Cursos

O sistema possui criação inteligente de cursos que automaticamente:

- **Cria tópicos** se não existirem
- **Reutiliza tópicos** existentes
- **Organiza por níveis** (Iniciante, Intermediário, Avançado)
- **Mantém compatibilidade** com sistema legacy

### 🎯 APIs de Busca Avançada

- Busca por **trilha + tópico**
- **Agrupamento** por tópicos
- **Filtragem** por nível
- **Listagem** de todos os tópicos disponíveis

### 🔐 Sistema de Segurança

- **JWT Authentication** com expiração configurável
- **Role-based access** (USER/ADMIN)
- **Guards personalizados** para proteção de rotas
- **Validação robusta** com class-validator

## 🌍 Variáveis de Ambiente

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=trilhas_conhecimento

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1d

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Application
NODE_ENV=development
PORT=3000
```

## 🛠️ Stack Tecnológica

### Backend Framework

- **NestJS** 9.x - Framework Node.js progressivo
- **TypeScript** 4.x - Superset tipado do JavaScript
- **Express** - HTTP server underlying

### Banco de Dados

- **PostgreSQL** 14+ - Banco relacional principal
- **TypeORM** 0.3.x - ORM para TypeScript/JavaScript

### Autenticação & Segurança

- **Passport.js** - Middleware de autenticação
- **JWT** - JSON Web Tokens
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de DTOs

### Infraestrutura

- **Docker** & **Docker Compose** - Containerização
- **NodeMailer** - Envio de emails

## 🚀 Deploy

### Docker Production

```bash
# Build da imagem
docker build -t trilhas-api .

# Run em produção
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e JWT_SECRET=your-secret \
  trilhas-api
```

### Variáveis Críticas para Produção

```env
NODE_ENV=production
JWT_SECRET=super-secure-random-string
DB_PASSWORD=secure-database-password
MAIL_PASS=smtp-app-password
```

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. Crie sua **feature branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### Padrões de Código

- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens de commit
- **TypeScript strict mode** habilitado

## 📞 Suporte

### Documentação

- 📖 **[API Documentation](./API_DOCUMENTATION.md)** - Referência completa da API
- 🔧 **[Developer Guide](./DEVELOPER_GUIDE.md)** - Guia para desenvolvedores
- 📋 **[Changelog](./CHANGELOG.md)** - Histórico de versões

### Issues e Bugs

- Reporte bugs através das **GitHub Issues**
- Para dúvidas, consulte a documentação primeiro
- Pull requests são bem-vindos!

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

Desenvolvido com ❤️ usando:

- [NestJS](https://nestjs.com/) - Framework principal
- [TypeORM](https://typeorm.io/) - ORM
- [PostgreSQL](https://postgresql.org/) - Banco de dados
- [Docker](https://docker.com/) - Containerização

---

## 🔮 Roadmap

### 🎯 Próximas Funcionalidades

- [ ] Sistema de progresso de cursos
- [ ] Dashboard administrativo
- [ ] Relatórios e analytics
- [ ] Sistema de recomendações
- [ ] Notificações push
- [ ] Integração com LMS externos

### 🚀 Melhorias Técnicas

- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Paginação avançada
- [ ] Websockets para real-time
- [ ] Testes automatizados completos
- [ ] CI/CD pipeline

---

Para começar a usar a API, consulte a **[Documentação Completa](./API_DOCUMENTATION.md)** 🚀
