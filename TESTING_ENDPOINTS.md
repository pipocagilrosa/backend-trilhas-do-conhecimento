# Testando os Endpoints de Carreiras para Usuários Logados

## Como Testar os Endpoints

### 1. Pré-requisitos

- Usuário registrado no sistema
- Token JWT válido obtido através do login
- Usuário inscrito em pelo menos uma carreira

### 2. Exemplos de Requisições

#### Obter Token JWT (Login)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

#### Inscrever-se em uma Carreira

```bash
curl -X POST http://localhost:3000/career-tracks/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -d '{
    "careerTrackId": "uuid-da-carreira"
  }'
```

#### Listar Resumo das Minhas Carreiras

```bash
curl -X GET http://localhost:3000/career-tracks/my-enrollments/summary \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

#### Listar Todas as Minhas Carreiras com Detalhes

```bash
curl -X GET http://localhost:3000/career-tracks/my-enrollments \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

#### Obter Detalhes de uma Carreira Específica Inscrita

```bash
curl -X GET http://localhost:3000/career-tracks/my-enrollments/uuid-da-carreira \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### 3. Estrutura de Resposta Esperada

#### Para `/my-enrollments/summary`:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Trilha de UX/UI Design",
    "area": "Design",
    "description": "Bem vindo à sua trilha de UX/UI Design.",
    "subTitle": "Aprecie nossa curadoria sem moderação!",
    "image": "https://exemplo.com/imagem.jpg",
    "index": 1,
    "totalTopics": 4,
    "totalCourses": 15,
    "completedCourses": 0
  }
]
```

#### Para `/my-enrollments` ou `/my-enrollments/:id`:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Trilha de UX/UI Design",
    "area": "Design",
    "description": "Bem vindo à sua trilha de UX/UI Design.",
    "subTitle": "Aprecie nossa curadoria sem moderação!",
    "content": "Nesta etapa você vai conhecer mais sobre os diferentes áreas de atuação do design e UX.",
    "image": "https://exemplo.com/imagem.jpg",
    "contentTitle": "Conhecendo a carreira",
    "contentImage": "https://exemplo.com/content-image.jpg",
    "contentSubtitle": "Agora vamos explorar os princípios e heurísticas de UX Design",
    "index": 1,
    "topics": [
      {
        "topic": "Conhecendo a carreira",
        "level": "Iniciante",
        "courses": [
          {
            "id": "course-uuid-1",
            "title": "Vídeo sobre a carreira de designer no Brasil",
            "description": "Vídeo no youtube do canal Bem da UX - duração 35 minutos",
            "url": "https://youtube.com/watch?v=exemplo",
            "price": 0,
            "hasCertificate": false,
            "isEnrollNeeded": false,
            "givenRatingAuthor": 4.5,
            "language": "Português",
            "typeContent": "Vídeo",
            "index": 1
          },
          {
            "id": "course-uuid-2",
            "title": "Vídeo sobre a carreira de designer no Brasil",
            "description": "Vídeo no youtube do canal Bem da UX - duração 35 minutos",
            "url": "https://youtube.com/watch?v=exemplo2",
            "price": 0,
            "hasCertificate": false,
            "isEnrollNeeded": false,
            "givenRatingAuthor": 4.2,
            "language": "Português",
            "typeContent": "Vídeo",
            "index": 2
          }
        ]
      },
      {
        "topic": "Heurísticas e Princípios Básicos de UX",
        "level": "Intermediário",
        "courses": [
          {
            "id": "course-uuid-3",
            "title": "Curso de Heurísticas de Nielsen",
            "description": "Vamos por a mão na massa, conheça frameworks e ferramentas de prototipação",
            "url": "https://exemplo.com/curso",
            "price": 49.90,
            "hasCertificate": true,
            "isEnrollNeeded": true,
            "givenRatingAuthor": 4.8,
            "language": "Português",
            "typeContent": "Curso Online",
            "index": 1
          }
        ]
      },
      {
        "topic": "Ferramentas",
        "level": "Avançado",
        "courses": [...]
      },
      {
        "topic": "Pesquisa e análise de usuário",
        "level": "Avançado",
        "courses": [...]
      }
    ]
  }
]
```

### 4. Códigos de Status HTTP

- **200 OK**: Requisição bem-sucedida
- **401 Unauthorized**: Token JWT inválido ou ausente
- **404 Not Found**: Carreira não encontrada ou usuário não inscrito
- **500 Internal Server Error**: Erro interno do servidor

### 5. Possíveis Erros

#### Token JWT Inválido

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### Carreira não encontrada ou usuário não inscrito

```json
{
  "statusCode": 404,
  "message": "Career track not found or user is not enrolled"
}
```

#### Usuário não encontrado

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

### 6. Notas Importantes

1. **Autenticação**: Todos os endpoints requerem o header `Authorization: Bearer {token}`
2. **Filtros**: Apenas carreiras, categorias e cursos ativos são retornados
3. **Ordenação**: Os dados são retornados ordenados por índice
4. **Níveis**: São organizados automaticamente na ordem: Iniciante → Intermediário → Avançado
5. **Segurança**: Usuários só podem acessar carreiras nas quais estão inscritos
