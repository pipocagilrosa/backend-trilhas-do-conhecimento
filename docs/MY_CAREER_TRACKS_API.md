# Endpoints de Carreiras para Usuários Logados - API

Este documento descreve os endpoints específicos para usuários autenticados acessarem suas carreiras inscritas.

## Endpoints para Usuários Logados

### 1. Resumo das Minhas Carreiras Inscritas

**GET** `/career-tracks/my-enrollments/summary`

- **Autenticação**: Obrigatória (JWT Token)
- **Descrição**: Retorna um resumo das carreiras nas quais o usuário está inscrito
- **Resposta**:

```json
[
  {
    "id": "uuid",
    "title": "Trilha de UX/UI Design",
    "area": "Design",
    "description": "Bem vindo à sua trilha de UX/UI Design.",
    "subTitle": "Aprecie nossa curadoria sem moderação!",
    "image": "url_da_imagem",
    "index": 1,
    "totalTopics": 4,
    "totalCourses": 15,
    "completedCourses": 0
  }
]
```

### 2. Minhas Carreiras Inscritas (Detalhado)

**GET** `/career-tracks/my-enrollments`

- **Autenticação**: Obrigatória (JWT Token)
- **Descrição**: Retorna todas as carreiras inscritas com tópicos, níveis e cursos organizados
- **Resposta**:

```json
[
  {
    "id": "uuid",
    "title": "Trilha de UX/UI Design",
    "area": "Design",
    "description": "Bem vindo à sua trilha de UX/UI Design.",
    "subTitle": "Aprecie nossa curadoria sem moderação!",
    "content": "Conteúdo da trilha...",
    "image": "url_da_imagem",
    "contentTitle": "Conhecendo a carreira",
    "contentImage": "url_da_imagem_conteudo",
    "contentSubtitle": "Subtitle do conteúdo",
    "index": 1,
    "topics": [
      {
        "topic": "Conhecendo a carreira",
        "level": "Iniciante",
        "courses": [
          {
            "id": "uuid",
            "title": "Vídeo sobre a carreira de designer no Brasil",
            "description": "Vídeo no youtube do canal Bem da UX - duração 35 minutos",
            "url": "https://youtube.com/...",
            "price": 0,
            "hasCertificate": false,
            "isEnrollNeeded": false,
            "givenRatingAuthor": 4.5,
            "language": "Português",
            "typeContent": "Vídeo",
            "index": 1
          }
        ]
      },
      {
        "topic": "Heurísticas e Princípios Básicos de UX",
        "level": "Intermediário",
        "courses": [...]
      }
    ]
  }
]
```

### 3. Detalhes de uma Carreira Inscrita Específica

**GET** `/career-tracks/my-enrollments/:id`

- **Autenticação**: Obrigatória (JWT Token)
- **Descrição**: Retorna os detalhes completos de uma carreira específica na qual o usuário está inscrito
- **Parâmetros**:
  - `id`: UUID da carreira
- **Resposta**: Mesma estrutura do endpoint anterior, mas apenas para uma carreira específica

### 4. Inscrever-se em uma Carreira

**POST** `/career-tracks/enroll`

- **Autenticação**: Obrigatória (JWT Token)
- **Descrição**: Inscreve o usuário logado em uma carreira específica
- **Body**:

```json
{
  "careerTrackId": "uuid_da_carreira"
}
```

- **Resposta**:

```json
{
  "message": "Successfully enrolled in the career track"
}
```

## Funcionalidades Implementadas

### Organização dos Dados

- **Tópicos**: Agrupados por nome do tópico
- **Níveis**: Organizados dentro de cada tópico (Iniciante → Intermediário → Avançado)
- **Cursos**: Ordenados por índice dentro de cada nível
- **Carreiras**: Ordenadas por índice

### Filtros Aplicados

- Apenas carreiras ativas (`inactive: false`)
- Apenas categorias ativas (`inactive: false`)
- Apenas cursos ativos (`inactive: false`)
- Apenas carreiras nas quais o usuário está inscrito

### Estrutura para a Tela do Frontend

Com base na imagem fornecida, os endpoints retornam dados organizados para preencher:

1. **Cabeçalho da Trilha**:

   - `title`: "Trilha de UX/UI Design"
   - `description`: "Bem vindo à sua trilha de UX/UI Design."
   - `subTitle`: "Aprecie nossa curadoria sem moderação!"

2. **Filtros por Nível**:

   - Baseado nos níveis disponíveis nos `topics`
   - "Iniciante", "Intermediário", "Avançado"

3. **Seções Colapsáveis**:

   - Cada `topic` representa uma seção
   - Exemplo: "1 - Conhecendo a carreira"
   - Com descrição de cada tópico

4. **Cursos dentro de cada Seção**:
   - Lista de `courses` dentro de cada `topic`
   - Com título, descrição e link para o conteúdo

## Uso Recomendado

### Para a Página "Minhas Trilhas"

Use `/career-tracks/my-enrollments/summary` para listar as carreiras inscritas com informações resumidas.

### Para a Página de Detalhes da Trilha Inscrita

Use `/career-tracks/my-enrollments/:id` para obter a estrutura completa da trilha específica, ideal para reproduzir a interface mostrada na imagem.

### Para Listagem Completa das Trilhas Inscritas

Use `/career-tracks/my-enrollments` quando precisar de todas as trilhas com detalhes completos.

## Segurança

- Todos os endpoints requerem autenticação via JWT
- Usuários só podem acessar carreiras nas quais estão inscritos
- Validação de usuário ativo (`inactive: false`)
- Verificação de existência do usuário no banco de dados
