# 📚 API Documentation - Backend Trilhas do Conhecimento

## 🚀 Base URL

```
https://trilhaconhecimento-jakltgda.b4a.run/
```

## 🔒 Autenticação

A API utiliza autenticação JWT. Para acessar endpoints protegidos, inclua o header:

```
Authorization: Bearer <jwt_token>
```

## 📋 Índice

- [Autenticação](#autenticação)
- [Usuários](#usuários)
- [Trilhas de Carreira](#trilhas-de-carreira)
- [Cursos](#cursos)

---

## 🔐 Autenticação

### Login

**POST** `/auth/login`

Realiza o login do usuário e retorna um token JWT.

**Request Body:**

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**

```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "role": "USER"
  }
}
```

---

## 👤 Usuários

### Cadastrar Usuário

**POST** `/user/signup`

Cria uma nova conta de usuário.

**Request Body:**

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "birthDate": "1990-01-01",
  "favoriteWordPhrase": "minha frase favorita"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "usuario@exemplo.com"
  }
}
```

### Obter Perfil do Usuário

**GET** `/user/:userId/profile`
🔒 **Requer autenticação**

Retorna os dados do perfil do usuário.

**Response:**

```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "birthDate": "1990-01-01",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Atualizar Perfil do Usuário

**PUT** `/user/:userId/profile-update`
🔒 **Requer autenticação**

Atualiza os dados do perfil do usuário.

**Request Body:**

```json
{
  "name": "Novo Nome",
  "email": "novo@exemplo.com",
  "birthDate": "1990-01-01"
}
```

**Response:**

```json
{
  "message": "User details updated successfully"
}
```

### Reset de Senha - Solicitar

**POST** `/user/reset-password`

Envia email para reset de senha.

**Request Body:**

```json
{
  "email": "usuario@exemplo.com"
}
```

### Reset de Senha - Confirmar

**POST** `/user/confirm-reset-password`

Confirma o reset de senha com token ou frase favorita.

**Request Body:**

```json
{
  "token": "token_do_email",
  "favoriteWordPhrase": "minha frase favorita",
  "newPassword": "nova_senha123"
}
```

### Confirmar Frase Favorita

**POST** `/user/confirm-pass`

Confirma a frase favorita para autenticação alternativa.

**Request Body:**

```json
{
  "token": "token_opcional",
  "favoriteWordPhrase": "minha frase favorita"
}
```

### Reset de Senha Seguro

**POST** `/user/reset-password-secure`
🔒 **Requer autenticação**

Altera senha usando senha atual.

**Request Body:**

```json
{
  "email": "usuario@exemplo.com",
  "oldPassword": "senha_atual",
  "newPassword": "nova_senha123"
}
```

### Desabilitar Usuário

**DELETE** `/user/:userId/disable`
🔒 **Requer autenticação**

Desabilita a conta do usuário.

### Inscrever em Trilhas de Carreira

**POST** `/user/:userId/enroll-career-tracks`
🔒 **Requer autenticação**

Inscreve o usuário em trilhas de carreira.

**Request Body:**

```json
{
  "careerTrackIds": ["uuid1", "uuid2"]
}
```

**Response:**

```json
{
  "message": "Successfully enrolled in the selected career tracks"
}
```

### Obter Trilhas Ativas do Usuário

**GET** `/user/:userId/active-career-tracks`
🔒 **Requer autenticação**

Retorna as trilhas de carreira ativas do usuário.

**Response:**

```json
[
  {
    "id": "uuid",
    "area": "Desenvolvimento Web",
    "description": "Trilha para desenvolvimento web",
    "image": "url_da_imagem",
    "userName": "Nome do Usuário"
  }
]
```

### Inscrever em Curso

**POST** `/user/:userId/enroll-course`
🔒 **Requer autenticação**

Inscreve o usuário em um curso específico.

**Request Body:**

```json
{
  "courseId": "uuid_do_curso"
}
```

**Response:**

```json
{
  "message": "Successfully enrolled in the course"
}
```

### Obter Cursos Ativos do Usuário

**GET** `/user/:userId/active-courses`
🔒 **Requer autenticação**

Retorna os cursos em que o usuário está inscrito.

---

## 🎯 Trilhas de Carreira

### Criar Trilha de Carreira

**POST** `/career-tracks`
🔒 **Requer autenticação de ADMIN**

Cria uma nova trilha de carreira.

**Request Body (exemplo completo):**

```json
{
  "area": "Design",
  "title": "UX/UI Designer",
  "description": "Trilha para profissionais de UX e UI Design, cobrindo fundamentos, ferramentas e práticas avançadas.",
  "subTitle": "Do básico ao avançado em UX/UI",
  "content": "Conteúdo detalhado da trilha, incluindo módulos, objetivos e roadmap.",
  "image": "https://cdn.exemplo.com/imagens/ux-ui.png",
  "contentTitle": "Conteúdo Programático",
  "contentSubtitle": "O que você vai aprender",
  "index": 1,
  "contentImage": "https://cdn.exemplo.com/imagens/ux-ui-conteudo.png"
}
```

> **Obs:** Todos os campos acima são obrigatórios, exceto `contentImage` (opcional).

### Listar Todas as Trilhas

**GET** `/career-tracks`

Retorna todas as trilhas de carreira disponíveis.

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "Desenvolvimento Web Full-Stack",
    "area": "Tecnologia",
    "description": "Trilha completa para desenvolvimento web",
    "image": "url_da_imagem",
    "inactive": false
  }
]
```

### Obter Trilha por ID

**GET** `/career-tracks/:id`

Retorna uma trilha específica.

### Listar Todos os Tópicos

**GET** `/career-tracks/topics`

Retorna todos os tópicos/categorias disponíveis.

**Response:**

```json
[
  {
    "id": "uuid",
    "topicName": "Frontend Frameworks",
    "level": "Iniciante",
    "careerTrackId": "uuid",
    "careerTrackTitle": "Desenvolvimento Web"
  }
]
```

### Criar Categoria/Tópico

### Obter Perfil do Usuário

**GET** `/user/:userId/profile`
🔒 **Requer autenticação**

Retorna os dados do perfil do usuário.

**Response:**

```json
{
  "id": "b1a7e8c2-1234-4f8a-9c2e-1a2b3c4d5e6f",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "birthDate": "15/05/1990",
  "favoriteWordPhrase": "Minha frase secreta",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**POST** `/career-tracks/categories`
🔒 **Requer autenticação de ADMIN**

Cria uma nova categoria/tópico.

**Request Body:**

````json
{
  "topicName": "Nome do Tópico",
  "level": "Iniciante",
  "careerTrackId": "uuid_da_trilha"
### Reset de Senha - Solicitar

**POST** `/user/reset-password`

Envia email para reset de senha.

**Request Body:**

```json
{
  "email": "joao@exemplo.com"
}
````

}

````

### Desabilitar Categoria

**PATCH** `/career-tracks/categories/:id/disable`
🔒 **Requer autenticação de ADMIN**

Desabilita uma categoria específica.

**Response:**

```json
{
### Reset de Senha - Confirmar

**POST** `/user/confirm-reset-password`

Confirma o reset de senha com token ou frase favorita.

**Request Body:**

```json
{
  "token": "c0d1g0-t0k3n-reset",
  "favoriteWordPhrase": "Minha frase secreta",
  "newPassword": "novasenha456"
}
````

"message": "Category disabled successfully"
}

````

### Inscrever em Trilha

**POST** `/career-tracks/enroll`
🔒 **Requer autenticação**

Inscreve o usuário autenticado em uma trilha.

**Request Body:**

### Confirmar Frase Favorita

**POST** `/user/confirm-pass`

Confirma a frase favorita para autenticação alternativa.

**Request Body:**

```json
{
  "token": "c0d1g0-t0k3n-reset",
  "favoriteWordPhrase": "Minha frase secreta"
}
````

```json
{
  "careerTrackId": "uuid_da_trilha"
}
```

**Response:**

```json
{
  "message": "Successfully enrolled in the career track"
}
```

### Obter Minhas Inscrições

### Reset de Senha Seguro

**POST** `/user/reset-password-secure`
🔒 **Requer autenticação**

Altera senha usando senha atual.

**Request Body:**

```json
{
  "email": "joao@exemplo.com",
  "oldPassword": "minhasenha123",
  "newPassword": "novasenha456"
}
```

**GET** `/career-tracks/my-enrollments`
🔒 **Requer autenticação**

Retorna as trilhas em que o usuário está inscrito.

### Obter Resumo das Minhas Inscrições

**GET** `/career-tracks/my-enrollments/summary`
🔒 **Requer autenticação**

Retorna um resumo das trilhas do usuário.

### Inscrever em Trilhas de Carreira

**POST** `/user/:userId/enroll-career-tracks`
🔒 **Requer autenticação**

Inscreve o usuário em trilhas de carreira.

**Request Body:**

```json
{
  "careerTrackIds": [
    "b7ae866f-fe7e-4983-a0c9-cc5b1e5dfbb6",
    "9f80704f-3d5a-4ec6-ac4a-5b7440006fad"
  ]
}
```

### Obter Inscrição Específica

**GET** `/career-tracks/my-enrollments/:id`
🔒 **Requer autenticação**

Retorna detalhes de uma trilha específica do usuário.

### Obter Categorias de uma Trilha (Autenticado)

**GET** `/career-tracks/:id/categories/authenticated`
🔒 **Requer autenticação**

Retorna as categorias de uma trilha com informações de inscrição.

### Inscrever em Curso

**POST** `/user/:userId/enroll-course`
🔒 **Requer autenticação**

Inscreve o usuário em um curso específico.

**Request Body:**

```json
{
  "courseId": "c1a2b3c4-d5e6-7890-abcd-1234567890ef"
}
```

### Obter Categorias de uma Trilha

**GET** `/career-tracks/:id/categories`

Retorna as categorias de uma trilha.

### Desabilitar Trilha

**PATCH** `/career-tracks/:id/disable`
🔒 **Requer autenticação de ADMIN**

Desabilita uma trilha de carreira.

**Response:**

````json
{
  "message": "Career disabled successfully"
### Obter Trilhas Ativas do Usuário

**GET** `/user/:userId/active-career-tracks`
🔒 **Requer autenticação**

Retorna as trilhas de carreira ativas do usuário.

**Response:**

```json
[
  {
    "id": "b7ae866f-fe7e-4983-a0c9-cc5b1e5dfbb6",
    "area": "Tecnologia",
    "title": "Desenvolvimento Web Full-Stack",
    "description": "Trilha completa para desenvolvimento web, do front ao back-end.",
    "image": "https://cdn.exemplo.com/imagens/web-fullstack.png",
    "userName": "João Silva"
  }
]
````

}

````

---

### Obter Cursos Ativos do Usuário

**GET** `/user/:userId/active-courses`
🔒 **Requer autenticação**

Retorna os cursos em que o usuário está inscrito.

**Response:**

```json
[
  {
    "id": "c1a2b3c4-d5e6-7890-abcd-1234567890ef",
    "title": "Angular Completo",
    "description": "Playlist do curso de Angular que engloba 4 módulos.",
    "level": "Avançado",
    "url": "https://www.youtube.com/watch?v=NCrWXZtlc7Q&list=PLdPPE0hUkt0rPyAkdhHIIquKbwrGUkvw3",
    "price": 0,
    "hasCertificate": false,
    "isEnrollNeeded": false,
    "givenRatingAuthor": 5,
    "topic": "Angular",
    "language": "PT",
    "typeContent": "Vídeo",
    "careerTrackId": "9f80704f-3d5a-4ec6-ac4a-5b7440006fad",
    "topicName": "Angular"
  }
]
````

## 📖 Cursos

### Criar Curso

**POST** `/courses`
🔒 **Requer autenticação de ADMIN**

Cria um novo curso. Suporta duas formas:

#### Forma 1: Com trilha e tópico (Recomendado)

**Request Body (exemplo real):**

```json
{
  "title": "Diferença entre UX e UI",
  "description": "Diferença entre UX e UI",
  "level": "Iniciante",
  "url": "https://www.youtube.com/watch?v=NDgfm_fjNq8",
  "price": 0,
  "hasCertificate": false,
  "isEnrollNeeded": false,
  "givenRatingAuthor": 4,
  "topic": "Introdução ao UX/UI Design",
  "language": "PT",
  "typeContent": "vídeo",
  "careerTrackId": "b7ae866f-fe7e-4983-a0c9-cc5b1e5dfbb6",
  "topicName": "Introdução ao UX/UI Design"
}
```

> **Obs:** Os tópicos/categorias são criados automaticamente se não existirem.

#### Forma 2: Com IDs de categorias (Legacy)

**Request Body (exemplo real):**

```json
{
  "title": "Vídeo sobre a carreira de designer no Brasil",
  "description": "Descubra o mercado de design no Brasil.",
  "level": "Iniciante",
  "url": "https://www.youtube.com/watch?v=xxxx",
  "price": 0,
  "hasCertificate": false,
  "isEnrollNeeded": false,
  "givenRatingAuthor": 5,
  "topic": "Conhecendo a carreira",
  "language": "PT",
  "typeContent": "vídeo",
  "categoriesIds": ["550e8400-e29b-41d4-a716-446655440000"]
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Introdução ao Angular",
  "description": "Conceitos básicos do Angular",
  "url": "https://exemplo.com/curso-angular",
  "price": 0,
  "hasCertificate": true,
  "isEnrollNeeded": false,
  "givenRatingAuthor": 4.5,
  "index": 1,
  "language": "Português",
  "typeContent": "Curso",
  "addedBy": {
    "id": "uuid",
    "name": "Admin User"
  },
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Listar Todos os Cursos

**GET** `/courses`

Retorna todos os cursos organizados por categorias.

**Response:**

```json
{
  "categories": [
    {
      "id": "uuid",
      "topicName": "Frontend Frameworks",
      "level": "Iniciante",
      "courses": [
        {
          "id": "uuid",
          "title": "Introdução ao Angular",
          "description": "Conceitos básicos do Angular",
          "url": "https://exemplo.com/curso-angular",
          "price": 0,
          "hasCertificate": true,
          "language": "Português",
          "typeContent": "Curso"
        }
      ]
    }
  ]
}
```

### Desabilitar Curso

**PATCH** `/courses/:id/disable`
🔒 **Requer autenticação de ADMIN**

Desabilita um curso específico.

**Response:**

```json
{
  "message": "Course disabled successfully"
}
```

### Buscar Cursos por Trilha e Tópico

**GET** `/courses/career/:careerTrackId/topic/:topicName`

**Exemplo de chamada:**

```bash
curl -X GET "https://trilhaconhecimento-jakltgda.b4a.run/courses/career/b7ae866f-fe7e-4983-a0c9-cc5b1e5dfbb6/topic/Introdução%20ao%20UX%2FUI%20Design"
```

**Exemplo de resposta:**

```json
[
  {
    "id": "uuid",
    "title": "Diferença entre UX e UI",
    "description": "Diferença entre UX e UI",
    "url": "https://www.youtube.com/watch?v=NDgfm_fjNq8",
    "price": 0,
    "hasCertificate": false,
    "language": "PT",
    "typeContent": "vídeo"
  }
]
```

### Obter Cursos Agrupados por Tópico

**GET** `/courses/career/:careerTrackId/grouped-by-topic`

Retorna cursos de uma trilha agrupados por tópico.

**Response:**

```json
{
  "Frontend Frameworks": [
    {
      "id": "uuid",
      "title": "Introdução ao Angular",
      "description": "Conceitos básicos do Angular"
    }
  ],
  "Backend Development": [
    {
      "id": "uuid",
      "title": "Node.js Essentials",
      "description": "Fundamentos do Node.js"
    }
  ]
}
```

---

## 📊 Status Codes

### Códigos de Sucesso

- `200` - OK: Requisição bem-sucedida
- `201` - Created: Recurso criado com sucesso
- `204` - No Content: Operação bem-sucedida sem conteúdo de retorno

### Códigos de Erro

- `400` - Bad Request: Dados inválidos na requisição
- `401` - Unauthorized: Token de autenticação inválido ou ausente
- `403` - Forbidden: Usuário não tem permissão para acessar o recurso
- `404` - Not Found: Recurso não encontrado
- `409` - Conflict: Conflito, como email já cadastrado
- `500` - Internal Server Error: Erro interno do servidor

---

## 🔧 Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=username
DB_PASSWORD=password
DB_DATABASE=trilhas_conhecimento

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d

# Email (para reset de senha)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_password
```

---

## 🚀 Como Usar

1. **Autenticação**: Primeiro, faça login para obter um token JWT
2. **Headers**: Inclua o token no header `Authorization: Bearer <token>`
3. **Permissões**: Alguns endpoints requerem role de ADMIN
4. **Validation**: Todos os endpoints validam os dados de entrada

### Exemplo de uso completo:

```javascript
// 1. Login
const loginResponse = await fetch("/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@exemplo.com",
    password: "senha123",
  }),
});

const { access_token } = await loginResponse.json();

// 2. Criar curso
const courseResponse = await fetch("/courses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  },
  body: JSON.stringify({
    title: "Meu Curso",
    description: "Descrição do curso",
    url: "https://exemplo.com/curso",
    price: 0,
    hasCertificate: true,
    careerTrackId: "uuid-da-trilha",
    topicName: "Meu Tópico",
    level: "Iniciante",
  }),
});
```

---

## 📝 Notas Importantes

1. **Autenticação JWT**: Tokens expiram em 1 dia por padrão
2. **Roles**: USER (padrão) e ADMIN
3. **Validação**: Todos os campos são validados usando class-validator
4. **CORS**: Configurado para desenvolvimento local
5. **Rate Limiting**: Não implementado (considere para produção)
6. **Pagination**: Não implementada (todas as listas retornam todos os itens)

---

Esta documentação cobre todas as funcionalidades principais da API. Para dúvidas específicas ou novos recursos, consulte o código fonte ou entre em contato com a equipe de desenvolvimento.
