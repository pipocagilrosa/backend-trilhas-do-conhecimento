# 🔧 Developer Guide - API Examples & Advanced Usage

## 🎯 Exemplos Práticos de Uso

### 1. Fluxo Completo de Usuário

#### 1.1 Cadastro e Login

```bash
# Cadastrar usuário
curl -X POST https://trilhaconhecimento-jakltgda.b4a.run/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "minhasenha123",
    "birthDate": "1990-05-15",
    "favoriteWordPhrase": "Minha frase secreta"
  }'

# Fazer login
curl -X POST https://trilhaconhecimento-jakltgda.b4a.run/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "minhasenha123"
  }'

# Response do login:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "joao@exemplo.com",
    "role": "USER"
  }
}
```

#### 1.2 Explorando Trilhas de Carreira

```bash
# Listar todas as trilhas disponíveis
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/career-tracks

# Ver detalhes de uma trilha específica
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/career-tracks/f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d

# Ver categorias/tópicos de uma trilha
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/career-tracks/f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d/categories
```

#### 1.3 Inscrição em Trilha

```bash
# Inscrever-se em uma trilha
curl -X POST https://trilhaconhecimento-jakltgda.b4a.run/career-tracks/enroll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "careerTrackId": "f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d"
  }'

# Ver minhas trilhas inscritas
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/career-tracks/my-enrollments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Gestão de Cursos (Admin)

#### 2.1 Criação de Curso Inteligente

```bash
# Criar curso com nova funcionalidade (recomendado)
curl -X POST https://trilhaconhecimento-jakltgda.b4a.run/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "title": "React Avançado com Hooks",
    "description": "Aprenda React hooks, context API e patterns avançados",
    "url": "https://plataforma.com/react-avancado",
    "price": 199.90,
    "hasCertificate": true,
    "isEnrollNeeded": true,
    "givenRatingAuthor": 4.8,
    "index": 2,
    "language": "Português",
    "typeContent": "Curso",
    "careerTrackId": "f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d",
    "topicName": "Frontend Frameworks",
    "level": "Avançado"
  }'
```

#### 2.2 Busca e Filtragem de Cursos

```bash
# Buscar cursos por trilha e tópico
curl -X GET "https://trilhaconhecimento-jakltgda.b4a.run/courses/career/f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d/topic/Frontend%20Frameworks"

# Ver todos os cursos agrupados por tópico
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/courses/career/f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d/grouped-by-topic

# Listar todos os cursos
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/courses
```

### 3. Scripts Python para Automação

#### 3.1 Script para Criação em Massa de Cursos

```python
import requests
import json

class CourseManager:
    def __init__(self, base_url, admin_token):
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {admin_token}'
        }

    def create_course(self, course_data):
        response = requests.post(
            f"{self.base_url}/courses",
            headers=self.headers,
            json=course_data
        )
        return response.json()

    def bulk_create_courses(self, courses_list):
        results = []
        for course in courses_list:
            try:
                result = self.create_course(course)
                results.append({"success": True, "data": result})
                print(f"✅ Curso '{course['title']}' criado com sucesso")
            except Exception as e:
                results.append({"success": False, "error": str(e)})
                print(f"❌ Erro ao criar curso '{course['title']}': {e}")
        return results

# Exemplo de uso
courses_data = [
    {
        "title": "JavaScript ES6+",
        "description": "Recursos modernos do JavaScript",
        "url": "https://exemplo.com/js-es6",
        "price": 89.90,
        "hasCertificate": True,
        "careerTrackId": "f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d",
        "topicName": "JavaScript Fundamentals",
        "level": "Intermediário"
    },
    {
        "title": "TypeScript para Iniciantes",
        "description": "Introdução ao TypeScript",
        "url": "https://exemplo.com/typescript",
        "price": 69.90,
        "hasCertificate": True,
        "careerTrackId": "f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d",
        "topicName": "JavaScript Fundamentals",
        "level": "Iniciante"
    }
]

manager = CourseManager("https://trilhaconhecimento-jakltgda.b4a.run", "YOUR_ADMIN_TOKEN")
results = manager.bulk_create_courses(courses_data)
```

#### 3.2 Script para Análise de Dados

```python
import requests
import pandas as pd
from datetime import datetime

class APIAnalyzer:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {token}'}

    def get_all_career_tracks(self):
        response = requests.get(f"{self.base_url}/career-tracks")
        return response.json()

    def get_all_courses(self):
        response = requests.get(f"{self.base_url}/courses")
        return response.json()

    def generate_report(self):
        career_tracks = self.get_all_career_tracks()
        courses_data = self.get_all_courses()

        # Análise básica
        report = {
            "total_career_tracks": len(career_tracks),
            "total_courses": sum(len(cat.get('courses', [])) for cat in courses_data.get('categories', [])),
            "categories_with_courses": len([cat for cat in courses_data.get('categories', []) if cat.get('courses')]),
            "generated_at": datetime.now().isoformat()
        }

        # Detalhes por categoria
        categories_detail = []
        for category in courses_data.get('categories', []):
            categories_detail.append({
                "topic": category.get('topicName'),
                "level": category.get('level'),
                "course_count": len(category.get('courses', [])),
                "avg_price": sum(c.get('price', 0) for c in category.get('courses', [])) / len(category.get('courses', [])) if category.get('courses') else 0
            })

        report["categories_detail"] = categories_detail
        return report

# Uso
analyzer = APIAnalyzer("https://trilhaconhecimento-jakltgda.b4a.run", "YOUR_TOKEN")
report = analyzer.generate_report()
print(json.dumps(report, indent=2))
```

### 4. Exemplos JavaScript/TypeScript

#### 4.1 Cliente API TypeScript

```typescript
interface ApiClient {
  baseURL: string;
  token?: string;
}

interface Course {
  id?: string;
  title: string;
  description: string;
  url: string;
  price: number;
  hasCertificate: boolean;
  careerTrackId?: string;
  topicName?: string;
  level?: string;
}

class TrilhasAPIClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; user: any }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    this.token = response.access_token;
    return response;
  }

  // Course methods
  async createCourse(courseData: Course) {
    return this.request<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  }

  async getAllCourses() {
    return this.request<{ categories: any[] }>("/courses");
  }

  async getCoursesByCareerAndTopic(careerTrackId: string, topicName: string) {
    return this.request<Course[]>(
      `/courses/career/${careerTrackId}/topic/${encodeURIComponent(topicName)}`
    );
  }

  // Career track methods
  async getAllCareerTracks() {
    return this.request<any[]>("/career-tracks");
  }

  async enrollInCareerTrack(careerTrackId: string) {
    return this.request("/career-tracks/enroll", {
      method: "POST",
      body: JSON.stringify({ careerTrackId }),
    });
  }

  async getMyEnrollments() {
    return this.request<any[]>("/career-tracks/my-enrollments");
  }
}

// Exemplo de uso
const client = new TrilhasAPIClient(
  "https://trilhaconhecimento-jakltgda.b4a.run"
);

async function example() {
  try {
    // Login
    await client.login("admin@exemplo.com", "senha123");

    // Criar curso
    const newCourse = await client.createCourse({
      title: "Vue.js 3 Composition API",
      description: "Aprenda a nova Composition API do Vue.js 3",
      url: "https://exemplo.com/vue3",
      price: 149.9,
      hasCertificate: true,
      careerTrackId: "f1c2a853-72d8-44a0-9d0d-5a8b9c1e2f3d",
      topicName: "Frontend Frameworks",
      level: "Intermediário",
    });

    console.log("Curso criado:", newCourse);
  } catch (error) {
    console.error("Erro:", error);
  }
}
```

#### 4.2 Hook React para API

```typescript
import { useState, useEffect } from "react";
import { TrilhasAPIClient } from "./api-client";

export function useCareerTracks() {
  const [careerTracks, setCareerTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareerTracks = async () => {
      try {
        const client = new TrilhasAPIClient(
          "https://trilhaconhecimento-jakltgda.b4a.run"
        );
        const tracks = await client.getAllCareerTracks();
        setCareerTracks(tracks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchCareerTracks();
  }, []);

  return { careerTracks, loading, error };
}

export function useCoursesByTopic(careerTrackId: string, topicName: string) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!careerTrackId || !topicName) return;

    const fetchCourses = async () => {
      try {
        const client = new TrilhasAPIClient(
          "https://trilhaconhecimento-jakltgda.b4a.run"
        );
        const coursesData = await client.getCoursesByCareerAndTopic(
          careerTrackId,
          topicName
        );
        setCourses(coursesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [careerTrackId, topicName]);

  return { courses, loading, error };
}
```

### 5. Casos de Uso Avançados

#### 5.1 Sistema de Recomendação

```bash
# 1. Obter trilhas do usuário
GET /career-tracks/my-enrollments

# 2. Para cada trilha, buscar cursos agrupados por tópico
GET /courses/career/{careerTrackId}/grouped-by-topic

# 3. Filtrar por nível do usuário e cursos não completados
GET /user/{userId}/active-courses
```

#### 5.2 Dashboard Administrativo

```bash
# Estatísticas gerais
GET /career-tracks           # Total de trilhas
GET /courses                 # Total de cursos por categoria
GET /career-tracks/topics    # Total de tópicos

# Dados para gráficos
GET /courses/career/{id}/grouped-by-topic  # Distribuição de cursos por tópico
```

#### 5.3 Sistema de Progresso

```bash
# Trilhas do usuário com progresso
GET /career-tracks/my-enrollments

# Cursos ativos (em progresso)
GET /user/{userId}/active-courses

# Detalhes de trilha específica com progresso
GET /career-tracks/my-enrollments/{id}
```

### 6. Testes Automatizados

#### 6.1 Jest Tests

```typescript
import { TrilhasAPIClient } from "../src/api-client";

describe("Trilhas API Client", () => {
  let client: TrilhasAPIClient;
  let authToken: string;

  beforeAll(async () => {
    client = new TrilhasAPIClient(
      "https://trilhaconhecimento-jakltgda.b4a.run"
    );
    const loginResponse = await client.login("admin@test.com", "password");
    authToken = loginResponse.access_token;
  });

  test("should create a course successfully", async () => {
    const courseData = {
      title: "Test Course",
      description: "A test course",
      url: "https://test.com/course",
      price: 99.9,
      hasCertificate: true,
      careerTrackId: "test-career-track-id",
      topicName: "Test Topic",
      level: "Iniciante",
    };

    const result = await client.createCourse(courseData);

    expect(result).toHaveProperty("id");
    expect(result.title).toBe(courseData.title);
    expect(result.price).toBe(courseData.price);
  });

  test("should fetch career tracks", async () => {
    const careerTracks = await client.getAllCareerTracks();

    expect(Array.isArray(careerTracks)).toBe(true);
    expect(careerTracks.length).toBeGreaterThan(0);
  });
});
```

### 7. Monitoramento e Logging

#### 7.1 Health Check Endpoint

```bash
# Verificar se a API está funcionando
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/health

# Verificar conexão com banco de dados
curl -X GET https://trilhaconhecimento-jakltgda.b4a.run/health/database
```

#### 7.2 Logs de Auditoria

```typescript
// Exemplo de como implementar logs de auditoria
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: Date;
  metadata?: any;
}

// Logs importantes para rastrear:
// - Criação de cursos
// - Inscrições em trilhas
// - Login/logout
// - Alterações de perfil
```

### 8. Performance e Otimização

#### 8.1 Caching Strategy

```bash
# Endpoints que se beneficiam de cache:
GET /career-tracks              # Cache: 1 hora
GET /career-tracks/{id}         # Cache: 30 minutos
GET /courses                    # Cache: 15 minutos
GET /career-tracks/topics       # Cache: 2 horas
```

#### 8.2 Pagination (Sugestão para implementação futura)

```bash
# Exemplos de como implementar paginação
GET /courses?page=1&limit=10&sort=createdAt&order=DESC
GET /career-tracks?page=2&limit=5
GET /user/{id}/active-courses?page=1&limit=20
```

### 9. Segurança

#### 9.1 Rate Limiting (Recomendação)

```typescript
// Sugestão de implementação
const rateLimits = {
  "/auth/login": "5 requests per minute",
  "/courses": "100 requests per hour",
  "/career-tracks": "200 requests per hour",
  "/user/*": "50 requests per minute",
};
```

#### 9.2 Validação de Entrada

```bash
# Todos os endpoints validam entrada usando class-validator
# Exemplos de validações implementadas:
# - Email format
# - Password strength
# - UUID format
# - Required fields
# - Data types
```

---

## 🚀 Deployment Guide

### Docker

```dockerfile
# Build da aplicação
docker build -t trilhas-api .

# Run com variáveis de ambiente
docker run -p 3000:3000 \
  -e DB_HOST=localhost \
  -e DB_PASSWORD=password \
  -e JWT_SECRET=your_secret \
  trilhas-api
```

### Docker Compose

```yaml
# Já existe no projeto - usar:
docker-compose up -d
```

---

Esta documentação técnica complementa a documentação principal da API, fornecendo exemplos práticos e padrões de uso para desenvolvedores.
