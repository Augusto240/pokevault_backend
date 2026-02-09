<div align="center">

# <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" width="32" /> PokéVault — Supply HQ

**Sistema de Gestão de Estoque para o Mundo Pokémon**

*Gotta Stock 'Em All!*

![Django](https://img.shields.io/badge/Django-5.2-092E20?style=flat-square&logo=django)
![DRF](https://img.shields.io/badge/DRF-3.16-A30000?style=flat-square)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat-square&logo=vuedotjs)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/Licença-MIT-yellow?style=flat-square)

</div>

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png" width="20" /> Sobre o Projeto

O **PokéVault** é um sistema completo de gestão de estoque inspirado no universo Pokémon, desenvolvido como **Projeto Integrador do IFRN**. Funciona como o sistema interno de um Centro de Distribuição de Suprimentos Pokémon — gerenciando Pokébolas, Poções, Berries, TMs e Itens de Batalha.

O sistema conta com um **backend Django REST API** robusto e um **frontend Vue.js 3** com interface minimalista e temática game-accurate, utilizando **sprites oficiais** no estilo dos jogos de DS/3DS/Switch.

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" width="20" /> Funcionalidades

### Gestão de Inventário
- CRUD completo de itens com categorias, preços e limites mínimos
- Alertas visuais de estoque crítico (abaixo do limite)
- Sprites automáticos baseados no nome do item (200+ mapeamentos)
- Upload de imagens personalizadas

### Transações
- Registro de entradas (reposição) e saídas (vendas/distribuição)
- Rastreamento por usuário com data/hora automáticos
- Filtros por tipo e busca por item

### Categorias
- Pokébolas, Poções, Berries, TMs/HMs, Itens de Batalha
- Ícones automáticos por categoria
- Organização visual com cores distintas

### Dashboard
- Estatísticas em tempo real (total de itens, críticos, movimentações do dia)
- Gráfico de estoque por categoria (Chart.js)
- Lista de estoque baixo com sprites
- Últimas movimentações com badges de tipo

### Análise de IA
- Integração com **Google Gemini** para análise de tendências
- Disponível para usuários com perfil Gerente
- Geração de insights baseados nos dados do estoque

### Relatórios
- Valor total em estoque (P$)
- Gráficos: proporção entradas/saídas, top 10 itens, movimentação por item
- Tabela detalhada com status e valor total por item

### Controle de Acesso
- Dois perfis: **★ Gerente** e **◆ Estoquista**
- Gerentes: acesso total (CRUD de usuários, IA, todas as áreas)
- Estoquistas: inventário, categorias, transações e relatórios
- Autenticação JWT com refresh automático

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" width="20" /> Tech Stack

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Python | 3.10+ | Linguagem |
| Django | 5.2 | Framework web |
| Django REST Framework | 3.16 | API REST |
| Simple JWT | 5.3+ | Autenticação JWT |
| drf-spectacular | 0.27+ | Documentação OpenAPI/Swagger |
| google-generativeai | 0.4+ | IA (Gemini) |
| Pillow | 11.0+ | Processamento de imagens |
| psycopg | 3.1+ | Driver PostgreSQL |
| Gunicorn | — | Servidor WSGI (produção) |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| Vue.js | 3.5 | Framework SPA (Composition API + `<script setup>`) |
| Vite | 7.x | Build tool |
| Pinia | 3.x | Gerenciamento de estado |
| Vue Router | 4.x | Roteamento SPA |
| Tailwind CSS | 4.x | Estilização utility-first |
| Chart.js + vue-chartjs | 4.5 / 5.3 | Gráficos |
| Heroicons | 2.x | Ícones SVG |
| Axios | 1.x | HTTP client |
| PokeAPI Sprites | — | Sprites pixel-art de itens |
| Press Start 2P | — | Fonte pixel para branding |

### Infraestrutura
| Tecnologia | Função |
|---|---|
| Docker + Docker Compose | Containerização |
| PostgreSQL 16 Alpine | Banco de dados |
| Nginx Alpine | Servidor web frontend |
| Gunicorn | Servidor WSGI backend |

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png" width="20" /> Estrutura do Projeto

```
pokevault/
├── 🐳 Dockerfile                  # Backend container (Python 3.12-slim)
├── 🐳 docker-compose.yml          # Orquestração (db + backend + frontend)
├── 🐳 .env.example                # Template de variáveis de ambiente
├── ⚙️ manage.py                   # CLI Django
├── 📋 requirements.txt            # Dependências Python
├── 🌱 populate_db.py              # Script de seed (dados iniciais)
│
├── pokevault/                     # Projeto Django (settings, urls, wsgi)
│   ├── settings.py                # Configs (env vars para Docker)
│   ├── urls.py                    # Rotas da API
│   ├── permissions.py             # IsGerente, IsEstoquista
│   └── wsgi.py / asgi.py
│
├── accounts/                      # App de autenticação
│   ├── models.py                  # User (email login, roles)
│   ├── serializers.py             # UserSerializer
│   └── views.py                   # UserViewSet + /me/
│
├── warehouse/                     # App principal de estoque
│   ├── models.py                  # Categoria, Item, Transacao
│   ├── serializers.py             # Serializers com campos extras
│   ├── views.py                   # ViewSets + dashboard + IA
│   ├── services.py                # Integração Gemini AI
│   └── signals.py                 # Validação de estoque + auto-update
│
└── frontend/                      # SPA Vue.js 3
    ├── 🐳 Dockerfile              # Multi-stage (node build + nginx)
    ├── 🐳 nginx.conf              # SPA routing + API proxy
    ├── package.json
    ├── index.html                  # Fonts (Inter + Press Start 2P)
    └── src/
        ├── main.js
        ├── style.css               # Tema PokéVault (animações, sprites)
        ├── services/api.js         # Axios + interceptors JWT
        ├── stores/auth.js          # Pinia (login, tokens, perfil)
        ├── router/index.js         # Rotas com guards de auth
        ├── utils/sprites.js        # Mapeamento item→sprite (200+)
        ├── layouts/AppLayout.vue   # Sidebar com sprites de navegação
        ├── components/
        │   ├── ModalDialog.vue     # Modal genérico com barra gradiente
        │   ├── StatsCard.vue       # Card de estatística com sprite
        │   └── SpriteIcon.vue      # Componente reutilizável de sprite
        └── views/
            ├── LoginView.vue       # Tela de login com sprites flutuantes
            ├── DashboardView.vue   # Visão geral + gráficos
            ├── InventarioView.vue  # CRUD de itens
            ├── CategoriasView.vue  # CRUD de categorias
            ├── TransacoesView.vue  # Registro de movimentações
            ├── UsuariosView.vue    # Gestão de funcionários (Gerente)
            └── RelatoriosView.vue  # Gráficos e relatório detalhado
```

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png" width="20" /> Início Rápido

### Opção 1 — Docker (recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/Augusto240/pokevault_backend.git
cd pokevault_backend

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações (SECRET_KEY, GEMINI_API_KEY, etc.)

# 3. Suba os containers
docker compose up --build -d

# 4. (Opcional) Popule o banco com dados de exemplo
docker compose exec backend python populate_db.py
```

Acesse:
- **Frontend:** [http://localhost](http://localhost)
- **API:** [http://localhost:8000/api/](http://localhost:8000/api/)
- **Swagger:** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)

### Opção 2 — Desenvolvimento Local

#### Backend

```bash
# Clone e entre no projeto
git clone https://github.com/Augusto240/pokevault_backend.git
cd pokevault_backend

# Crie e ative o virtualenv
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate    # Windows

# Instale dependências
pip install -r requirements.txt

# Configure o PostgreSQL (crie o banco pokevault_db)
# Edite pokevault/settings.py ou defina variáveis de ambiente:
#   DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT

# Execute migrações e inicie o servidor
python manage.py migrate
python manage.py runserver
```

#### Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend roda em `http://localhost:5173` com proxy automático para a API.

#### Dados Iniciais

```bash
# Popule o banco com categorias, itens e um usuário de teste
python populate_db.py
```

Credenciais de teste criadas pelo seed:
| Campo | Valor |
|---|---|
| E-mail | `ash@pokevault.com` |
| Senha | `pikachubestfriend` |
| Perfil | Estoquista |

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png" width="20" /> Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `DEBUG` | Modo debug do Django | `False` |
| `SECRET_KEY` | Chave secreta do Django | ⚠️ Altere em produção |
| `ALLOWED_HOSTS` | Hosts permitidos | `*` |
| `POSTGRES_DB` | Nome do banco | `pokevault_db` |
| `POSTGRES_USER` | Usuário do banco | `postgres` |
| `POSTGRES_PASSWORD` | Senha do banco | `password` |
| `GEMINI_API_KEY` | Chave da API Google Gemini (opcional) | — |

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png" width="20" /> API — Endpoints

Base: `/api/`

### Autenticação (JWT)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/token/` | Obter tokens (email + password) |
| `POST` | `/api/token/refresh/` | Renovar access token |

> O `User` usa `email` como `USERNAME_FIELD`. Header: `Authorization: Bearer <access_token>`

### Recursos CRUD

| Recurso | Endpoint | Permissão |
|---|---|---|
| Usuários | `/api/users/` | Gerente |
| Perfil atual | `/api/users/me/` | Autenticado |
| Categorias | `/api/categorias/` | Autenticado |
| Itens | `/api/itens/` | Autenticado |
| Estoque Baixo | `/api/itens/estoque_baixo/` | Autenticado |
| Transações | `/api/transacoes/` | Autenticado |

### Dashboard & IA

| Método | Endpoint | Permissão | Descrição |
|---|---|---|---|
| `GET` | `/api/dashboard/stats/` | Autenticado | Estatísticas rápidas |
| `POST` | `/api/dashboard/ia-analysis/` | Gerente | Análise Gemini AI |

### Documentação

| Endpoint | Descrição |
|---|---|
| `/api/docs/` | Swagger UI (interativo) |
| `/api/schema/` | Schema OpenAPI (JSON) |

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png" width="20" /> Modelos de Dados

### User (`accounts.models`)
```
email (USERNAME_FIELD, único) · username · first_name · last_name
matricula (único) · role (GERENTE | ESTOQUISTA)
```

### Categoria (`warehouse.models`)
```
nome · descricao
```

### Item (`warehouse.models`)
```
nome · categoria (FK) · quantidade · limite_minimo
preco_unitario (decimal) · imagem (upload) · created_at · updated_at
→ Propriedade: is_estoque_baixo (quantidade <= limite_minimo)
→ Serializer: categoria_nome, status_estoque (OK | CRITICO)
```

### Transacao (`warehouse.models`)
```
item (FK) · usuario (FK, auto via request.user) · tipo (ENTRADA | SAIDA)
quantidade · data_hora (auto) · observacao
→ Serializer: item_nome, usuario_nome
```

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucky-egg.png" width="20" /> Sprites & Tema Visual

O frontend utiliza **sprites oficiais do PokeAPI** com renderização pixel-art (`image-rendering: pixelated`), seguindo a estética dos jogos de DS/3DS/Switch.

- **200+ mapeamentos** de nomes de itens para sprites (Pokébolas, Poções, Berries, TMs, itens de batalha, etc.)
- **Componente `SpriteIcon.vue`** reutilizável com fallback automático
- **Fonte pixel "Press Start 2P"** para títulos e branding
- **Animações temáticas:** pokebounce, pokefloat, shimmer, pokespin
- **Paleta de cores:** pokered, pokeblue, pokeyellow + escala slate
- **Cards, badges e botões** com estilo game-inspired

Fonte dos sprites: [PokeAPI/sprites](https://github.com/PokeAPI/sprites) (`sprites/items/`)

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/x-attack.png" width="20" /> Docker

O projeto é totalmente containerizado com 3 serviços:

| Serviço | Imagem | Porta | Função |
|---|---|---|---|
| `db` | postgres:16-alpine | 5432 | Banco de dados |
| `backend` | python:3.12-slim + gunicorn | 8000 | API Django |
| `frontend` | node:20-alpine → nginx:alpine | 80 | SPA Vue.js |

```bash
# Subir tudo
docker compose up --build -d

# Ver logs
docker compose logs -f

# Parar tudo
docker compose down

# Resetar banco
docker compose down -v
```

---

## <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/scope-lens.png" width="20" /> Observações Importantes

- Ao criar uma **Transação** via API, o campo `usuario` é preenchido automaticamente pelo backend com o usuário autenticado.
- A rota de **Análise de IA** depende da variável `GEMINI_API_KEY`. Sem ela, retorna `{"error": "API Key do Gemini não configurada."}`.
- **Uploads de imagem** são armazenados em `MEDIA_ROOT` (volume `media_data` no Docker).
- O **Nginx** do frontend faz proxy reverso de `/api/`, `/admin/` e `/media/` para o backend.
- O **script `populate_db.py`** cria 1 usuário, 5 categorias e 9 itens de exemplo.

---

<div align="center">

**Projeto Integrador — IFRN 2025**

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" width="20" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png" width="20" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png" width="20" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" width="20" />

*PokéVault v2.0 — Gotta Stock 'Em All!*

</div>

**Exemplos de uso (curl)**

- Obter token (autenticar):

```sh
curl -X POST http://127.0.0.1:8000/api/token/ \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@example.com","password":"senha"}'
```

- Usar token para listar itens:

```sh
curl -H "Authorization: Bearer <ACCESS_TOKEN>" \
	http://127.0.0.1:8000/api/itens/
```

- Criar transação (registro de saída/entrada):

```sh
curl -X POST http://127.0.0.1:8000/api/transacoes/ \
	-H "Authorization: Bearer <ACCESS_TOKEN>" \
	-H "Content-Type: application/json" \
	-d '{"tipo":"SAIDA","item":1,"quantidade":5}'
```

**Admin & Deploy**
- Acesse `/admin/` com superuser criado via `createsuperuser`.
- Em produção substitua `DEBUG=False`, configure `ALLOWED_HOSTS`, gere `SECRET_KEY` segura, use um servidor WSGI (Gunicorn/uWSGI) e um serviço para `MEDIA` e `STATIC` (S3, CDN, etc.).

**Observações de segurança / melhorias sugeridas**
- Não exponha `SECRET_KEY` no repositório.
- Proteja `GEMINI_API_KEY` e não comite credenciais.
- Considere validar e controlar uploads de imagem (tamanho/formato) e usar um armazenamento externo em produção.
- Adicionar testes automatizados para endpoints críticos (transações, permissões).

