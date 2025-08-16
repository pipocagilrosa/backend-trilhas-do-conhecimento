# 📚 Documentação - Índice Geral

## 🎯 Documentação Principal

### 🏠 [README Principal](./README.md)

Visão geral do projeto, instalação e configuração básica.

### 📖 [API Documentation](./API_DOCUMENTATION.md)

**Documentação completa da API** com todos os endpoints, exemplos de request/response, códigos de erro e guias de uso.

### 🔧 [Developer Guide](./DEVELOPER_GUIDE.md)

**Guia técnico para desenvolvedores** com exemplos práticos, scripts, clientes API, hooks React e casos de uso avançados.

### 📋 [Changelog](./CHANGELOG.md)

**Histórico de versões** com todas as mudanças, novas funcionalidades e correções implementadas.

---

## 📊 Dados e Exemplos

### 🎯 [Payloads CSV](./PAYLOADS_CURSOS_CSV.md)

**Dados estruturados** de 48 cursos organizados por trilhas de carreira, prontos para importação em massa.

---

## 🚀 Guias de Início Rápido

### Para **Usuários da API**:

1. 📖 Leia a **[API Documentation](./API_DOCUMENTATION.md)**
2. 🔐 Configure autenticação JWT
3. 🎯 Use os endpoints de trilhas e cursos
4. 📝 Consulte os exemplos de payload

### Para **Desenvolvedores**:

1. 🏠 Configure o ambiente seguindo o **[README](./README.md)**
2. 🔧 Explore os exemplos no **[Developer Guide](./DEVELOPER_GUIDE.md)**
3. 📊 Use os dados do **[CSV Payloads](./PAYLOADS_CURSOS_CSV.md)**
4. 📋 Acompanhe atualizações no **[Changelog](./CHANGELOG.md)**

### Para **Administradores**:

1. 🐳 Deploy com Docker seguindo o **[README](./README.md)**
2. 🔑 Configure variáveis de ambiente de produção
3. 📖 Use endpoints de admin da **[API Documentation](./API_DOCUMENTATION.md)**
4. 📊 Importe dados usando **[CSV Payloads](./PAYLOADS_CURSOS_CSV.md)**

---

## 🎯 Casos de Uso Rápidos

### 🔐 **Autenticação**

```bash
# Ver exemplos completos em API_DOCUMENTATION.md
POST /auth/login
```

### 👤 **Cadastro de Usuário**

```bash
# Ver payload completo em API_DOCUMENTATION.md
POST /user/signup
```

### 🎯 **Listar Trilhas**

```bash
# Ver resposta detalhada em API_DOCUMENTATION.md
GET /career-tracks
```

### 📖 **Criar Curso Inteligente**

```bash
# Ver sistema inteligente em DEVELOPER_GUIDE.md
POST /courses
```

---

## 📊 Estatísticas da Documentação

| Arquivo                    | Conteúdo                    | Páginas Aprox. |
| -------------------------- | --------------------------- | -------------- |
| **API_DOCUMENTATION.md**   | Referência completa da API  | ~15 páginas    |
| **DEVELOPER_GUIDE.md**     | Exemplos e códigos práticos | ~12 páginas    |
| **CHANGELOG.md**           | Histórico de versões        | ~5 páginas     |
| **PAYLOADS_CURSOS_CSV.md** | Dados estruturados          | ~3 páginas     |
| **README.md**              | Visão geral e setup         | ~8 páginas     |

**Total: ~43 páginas de documentação técnica completa**

---

## 🔍 Busca Rápida por Tópico

### **Autenticação e Segurança**

- JWT Setup: [API_DOCUMENTATION.md#autenticação](./API_DOCUMENTATION.md#🔐-autenticação)
- Roles e Guards: [DEVELOPER_GUIDE.md#segurança](./DEVELOPER_GUIDE.md#9-segurança)
- Variáveis de ambiente: [README.md#variáveis](./README.md#🌍-variáveis-de-ambiente)

### **Trilhas de Carreira**

- APIs de trilhas: [API_DOCUMENTATION.md#trilhas](./API_DOCUMENTATION.md#🎯-trilhas-de-carreira)
- Sistema de inscrições: [DEVELOPER_GUIDE.md#trilhas](./DEVELOPER_GUIDE.md#13-inscrição-em-trilha)
- Dados CSV: [PAYLOADS_CURSOS_CSV.md](./PAYLOADS_CURSOS_CSV.md)

### **Sistema de Cursos**

- API de cursos: [API_DOCUMENTATION.md#cursos](./API_DOCUMENTATION.md#📖-cursos)
- Sistema inteligente: [CHANGELOG.md#sistema-inteligente](./CHANGELOG.md#sistema-inteligente-de-criação-de-cursos)
- Exemplos avançados: [DEVELOPER_GUIDE.md#cursos](./DEVELOPER_GUIDE.md#2-gestão-de-cursos-admin)

### **Setup e Deploy**

- Instalação: [README.md#início-rápido](./README.md#🚀-início-rápido)
- Docker: [README.md#docker](./README.md#🐳-executar-com-docker-recomendado)
- Produção: [DEVELOPER_GUIDE.md#deployment](./DEVELOPER_GUIDE.md#🚀-deployment-guide)

### **Exemplos de Código**

- Python scripts: [DEVELOPER_GUIDE.md#python](./DEVELOPER_GUIDE.md#31-script-para-criação-em-massa-de-cursos)
- TypeScript client: [DEVELOPER_GUIDE.md#typescript](./DEVELOPER_GUIDE.md#41-cliente-api-typescript)
- React hooks: [DEVELOPER_GUIDE.md#react](./DEVELOPER_GUIDE.md#42-hook-react-para-api)

---

## 🆘 Ajuda e Suporte

### 🔍 **Não encontrou o que procura?**

1. 🔍 Use **Ctrl+F** para buscar termos específicos nos documentos
2. 📖 Consulte a seção de **exemplos práticos** no Developer Guide
3. 🐛 Reporte problemas via GitHub Issues
4. 💡 Sugestões são bem-vindas via Pull Requests

### 📞 **Ordem de Consulta Recomendada**

1. **Problema de uso básico** → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Implementação técnica** → [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
3. **Setup e configuração** → [README.md](./README.md)
4. **Dados para testes** → [PAYLOADS_CURSOS_CSV.md](./PAYLOADS_CURSOS_CSV.md)
5. **Histórico de mudanças** → [CHANGELOG.md](./CHANGELOG.md)

---

## 🎯 Links Úteis

- 🌐 **Base URL**: `https://trilhaconhecimento-jakltgda.b4a.run`
- 🐳 **Docker Hub**: (configurar se publicado)
- 📋 **Issues**: GitHub Issues do repositório
- 💻 **Repositório**: GitHub repository URL

---

**Esta documentação é mantida atualizada a cada versão. Para dúvidas específicas, consulte os arquivos individuais ou abra uma issue no GitHub.** 🚀
