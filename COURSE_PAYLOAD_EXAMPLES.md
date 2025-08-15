# 📋 Exemplos de Payload para Cadastro de Curso

## 🚀 **Endpoint:** `POST /courses`

### 🔐 **Autenticação Necessária:**

- JWT Token de usuário ADMIN
- Header: `Authorization: Bearer {token}`

---

## 📝 **Exemplo 1: Curso Gratuito de Vídeo (Iniciante)**

```json
{
  "title": "Vídeo sobre a carreira de designer no Brasil",
  "description": "Vídeo no youtube do canal Bem da UX - duração 35 minutos. Conheça mais sobre as diferentes áreas de atuação do design e UX no mercado brasileiro.",
  "level": "Iniciante",
  "url": "https://youtube.com/watch?v=exemplo123",
  "price": 0,
  "hasCertificate": false,
  "isEnrollNeeded": false,
  "givenRatingAuthor": 4.5,
  "topic": "Conhecendo a carreira",
  "index": 1,
  "language": "Português",
  "typeContent": "Vídeo",
  "categoriesIds": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

## 📝 **Exemplo 2: Curso Pago com Certificado (Intermediário)**

```json
{
  "title": "Fundamentos de UX Research - Pesquisa com Usuários",
  "description": "Curso completo sobre pesquisa com usuários, incluindo métodos quantitativos e qualitativos, análise de dados e criação de personas.",
  "level": "Intermediário",
  "url": "https://plataforma-cursos.com/ux-research-fundamentos",
  "price": 199.9,
  "hasCertificate": true,
  "isEnrollNeeded": true,
  "givenRatingAuthor": 4.8,
  "topic": "Pesquisa e análise de usuário",
  "index": 1,
  "language": "Português",
  "typeContent": "Curso Online",
  "categoriesIds": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002"
  ]
}
```

## 📝 **Exemplo 3: Workshop Presencial (Avançado)**

```json
{
  "title": "Workshop: Prototipação Avançada com Figma",
  "description": "Workshop intensivo de 8 horas para aprender técnicas avançadas de prototipação, componentes reutilizáveis e design systems no Figma.",
  "level": "Avançado",
  "url": "https://eventbrite.com/workshop-figma-avancado",
  "price": 350.0,
  "hasCertificate": true,
  "isEnrollNeeded": true,
  "givenRatingAuthor": 5.0,
  "topic": "Ferramentas",
  "index": 3,
  "language": "Português",
  "typeContent": "Workshop Presencial",
  "categoriesIds": ["550e8400-e29b-41d4-a716-446655440003"]
}
```

## 📝 **Exemplo 4: Artigo/E-book (Múltiplas Categorias)**

```json
{
  "title": "Guia Completo das Heurísticas de Nielsen",
  "description": "E-book gratuito com explicação detalhada das 10 heurísticas de usabilidade de Jakob Nielsen, com exemplos práticos e exercícios.",
  "level": "Intermediário",
  "url": "https://site.com/ebook-heuristicas-nielsen.pdf",
  "price": 0,
  "hasCertificate": false,
  "isEnrollNeeded": false,
  "givenRatingAuthor": 4.2,
  "topic": "Heurísticas e Princípios Básicos de UX",
  "index": 2,
  "language": "Português",
  "typeContent": "E-book",
  "categoriesIds": [
    "550e8400-e29b-41d4-a716-446655440004",
    "550e8400-e29b-41d4-a716-446655440005"
  ]
}
```

## 📝 **Exemplo 5: Curso em Inglês (Conteúdo Internacional)**

```json
{
  "title": "Advanced Design Systems Architecture",
  "description": "Learn how to build scalable design systems for large organizations. Covers component libraries, design tokens, and governance strategies.",
  "level": "Avançado",
  "url": "https://udemy.com/design-systems-architecture",
  "price": 89.99,
  "hasCertificate": true,
  "isEnrollNeeded": true,
  "givenRatingAuthor": 4.7,
  "topic": "Ferramentas",
  "language": "English",
  "typeContent": "Online Course",
  "categoriesIds": ["550e8400-e29b-41d4-a716-446655440006"]
}
```

---

## ⚠️ **Campos Obrigatórios vs Opcionais:**

### ✅ **Obrigatórios:**

- `title` (string)
- `description` (string)
- `level` (string)
- `url` (string)
- `price` (number)
- `hasCertificate` (boolean)
- `isEnrollNeeded` (boolean)
- `givenRatingAuthor` (number 0-5)
- `topic` (string)
- `language` (string)
- `categoriesIds` (array de UUIDs)

### 🔄 **Opcionais:**

- `index` (number) - padrão: 0
- `typeContent` (string) - padrão: ""

---

## 🔍 **Validações Importantes:**

1. **givenRatingAuthor**: Deve ser entre 0 e 5
2. **categoriesIds**: Deve conter UUIDs válidos de categorias existentes
3. **price**: Deve ser número (pode ser 0 para cursos gratuitos)
4. **url**: Deve ser uma URL válida

---

## 🚀 **Como testar:**

```bash
curl -X POST "http://localhost:3000/courses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN_ADMIN" \
  -d '{
    "title": "Exemplo de Curso",
    "description": "Descrição do curso exemplo",
    "level": "Iniciante",
    "url": "https://exemplo.com/curso",
    "price": 0,
    "hasCertificate": false,
    "isEnrollNeeded": false,
    "givenRatingAuthor": 4.0,
    "topic": "Tópico Exemplo",
    "language": "Português",
    "typeContent": "Vídeo",
    "categoriesIds": ["uuid-categoria-existente"]
  }'
```

---

## 💡 **Dicas:**

1. **Sempre use UUIDs reais** nas `categoriesIds`
2. **Defina um `index`** para controlar a ordem dos cursos
3. **Use `typeContent`** para categorizar o tipo de conteúdo
4. **Seja específico na `description`** para melhor experiência do usuário
