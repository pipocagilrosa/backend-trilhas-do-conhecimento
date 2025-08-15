# 🔍 Análise: Múltiplos Cursos para o Mesmo Tópico

## ❓ **Pergunta:** "Se eu tiver mais de um curso para um mesmo tópico... o que acontece?"

## ✅ **Resposta:** Os cursos são **agrupados e listados juntos** no mesmo tópico!

---

## 🏗️ **Como Funciona na Prática:**

### **Cenário: 3 cursos no tópico "Conhecendo a carreira"**

#### **1. Estrutura no Banco:**

```
CategoryCourse:
- id: cat-1, topic: "Conhecendo a carreira", level: "Iniciante", courses: [curso-1, curso-2]
- id: cat-2, topic: "Conhecendo a carreira", level: "Intermediário", courses: [curso-3]
```

#### **2. Como aparecem na API:**

```json
{
  "topic": "Conhecendo a carreira",
  "levels": [
    {
      "level": "Iniciante",
      "courses": [
        {
          "id": "curso-1",
          "title": "Vídeo sobre carreira de designer no Brasil",
          "index": 1
        },
        {
          "id": "curso-2",
          "title": "Podcast sobre mercado de UX",
          "index": 2
        }
      ]
    },
    {
      "level": "Intermediário",
      "courses": [
        {
          "id": "curso-3",
          "title": "Artigo sobre evolução profissional",
          "index": 1
        }
      ]
    }
  ]
}
```

---

## 📋 **Comportamentos Específicos:**

### ✅ **1. Agrupamento por Tópico + Nível**

- Cursos do mesmo tópico e nível ficam **juntos na mesma lista**
- Ordenados pelo campo `index` (crescente)

### ✅ **2. Múltiplos Níveis no Mesmo Tópico**

- Se tiver "Conhecendo a carreira" Iniciante E Intermediário
- Aparece como **2 seções separadas** dentro do mesmo tópico

### ✅ **3. Ordenação Automática**

- **Por tópico**: Ordem alfabética
- **Por nível**: Iniciante → Intermediário → Avançado
- **Por cursos**: Campo `index` (definido no cadastro)

### ✅ **4. Não Há Duplicação**

- Cada curso aparece apenas uma vez
- Mesmo se estiver em múltiplas categorias

---

## 🎯 **Exemplos Práticos:**

### **Exemplo 1: Mesmo Tópico, Mesmo Nível**

```bash
# Cadastrar múltiplos cursos na mesma categoria
POST /courses
{
  "title": "Vídeo 1 - Carreira de Designer",
  "topic": "Conhecendo a carreira",
  "level": "Iniciante",
  "index": 1,
  "categoriesIds": ["cat-conhecendo-carreira-iniciante"]
}

POST /courses
{
  "title": "Vídeo 2 - Áreas do Design",
  "topic": "Conhecendo a carreira",
  "level": "Iniciante",
  "index": 2,
  "categoriesIds": ["cat-conhecendo-carreira-iniciante"]
}
```

**Resultado:** 2 cursos listados juntos no tópico "Conhecendo a carreira" nível Iniciante

### **Exemplo 2: Mesmo Tópico, Níveis Diferentes**

```bash
# Categorias diferentes para o mesmo tópico
POST /career-tracks/categories
{
  "topic": "Conhecendo a carreira",
  "level": "Iniciante"
}

POST /career-tracks/categories
{
  "topic": "Conhecendo a carreira",
  "level": "Intermediário"
}

# Cursos em cada categoria
POST /courses (categoria iniciante)
POST /courses (categoria intermediário)
```

**Resultado:** Tópico com 2 níveis, cada um com seus cursos

---

## 🔧 **Controle da Ordem dos Cursos:**

### **Campo `index` controla a ordem:**

```json
[
  { "title": "Curso A", "index": 1 }, // Aparece primeiro
  { "title": "Curso B", "index": 2 }, // Aparece segundo
  { "title": "Curso C", "index": 3 } // Aparece terceiro
]
```

### **Se não definir `index`:**

- Padrão: 0
- Ordem pode ser imprevísível entre cursos com mesmo index

---

## ⚠️ **Considerações Importantes:**

### **1. Limite Prático**

- Não há limite técnico de cursos por tópico
- Recomendado: máximo 10-15 cursos por tópico para UX

### **2. Performance**

- Muitos cursos podem impactar tempo de resposta
- Considere paginação para tópicos com 20+ cursos

### **3. Organização Visual**

- No frontend, cursos do mesmo tópico aparecerão como uma lista
- Use `index` para controlar ordem pedagógica

---

## 🎯 **Resumo:**

**✅ Múltiplos cursos no mesmo tópico funcionam perfeitamente!**

- São **agrupados juntos**
- **Ordenados pelo `index`**
- **Separados por nível** se necessário
- **Uma seção por combinação** tópico+nível

**Exemplo visual no frontend:**

```
📖 1 - Conhecendo a carreira ⌄
  📚 Vídeo sobre carreira de designer (Iniciante)
  📚 Podcast sobre mercado UX (Iniciante)
  📚 Artigo sobre evolução profissional (Intermediário)

📖 2 - Heurísticas e Princípios ⌄
  📚 Guia das 10 heurísticas de Nielsen (Intermediário)
```

A estrutura atual suporta muito bem múltiplos cursos por tópico! 🚀
