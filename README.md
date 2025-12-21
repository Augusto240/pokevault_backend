# PokéVault - Backend

**Visão Geral**
- **Descrição:** Backend Django REST para gestão de estoque e transações do PokéVault (centro de distribuição).
- **Stack:** Python, Django, Django REST Framework, Simple JWT, drf-spectacular (OpenAPI/Swagger).

**Pré-requisitos**
- **Python:** 3.8+ (recomendo 3.10/3.11)
- **Banco:** PostgreSQL (configurado em `pokevault/settings.py`)
- **Dependências:** listar em `requirements.txt`.

**Instalação & Execução (local)**
- Clone o repositório e entre na pasta do projeto.

```sh
git clone https://github.com/Augusto240/pokevault_backend.git
cd pokevault_backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

- Configure variáveis de ambiente (veja seção abaixo).
- Crie o banco e execute migrações:

```sh
python manage.py migrate
python manage.py createsuperuser  # opcional para acessar /admin/
python manage.py runserver
```

**Variáveis de ambiente importantes**
- **`DATABASE_URL` / configuração em `pokevault/settings.py`:** ajuste credenciais de PostgreSQL conforme seu ambiente.
- **`GEMINI_API_KEY`**: chave para a integração de IA (Google Gemini) usada pela rota de análise (`/api/dashboard/ia-analysis/`). Se não definida, a rota retorna um erro informativo.
- **`DJANGO_SECRET_KEY`**: em produção troque a `SECRET_KEY` do settings.

**Banco de dados & Migrações**
- O projeto usa PostgreSQL conforme `pokevault/settings.py`.
- Após configurar credenciais, rode `python manage.py migrate` para criar tabelas.

**Autenticação**
- JWT via `rest_framework_simplejwt`.
- Endpoints:
	- `POST /api/token/` — obter `access` e `refresh` tokens (corpo: `{ "email": "...", "password": "..." }` já que o `User` usa `email` como `USERNAME_FIELD`).
	- `POST /api/token/refresh/` — renovar `access` (corpo: `{ "refresh": "<token>" }`).

Use o header `Authorization: Bearer <access_token>` para chamadas autenticadas.

**Rotas da API**
- Base: todas as rotas da API ficam sob o prefixo `/api/`.
- Documentação OpenAPI/Swagger: `GET /api/docs/`.
- Schema (OpenAPI JSON): `GET /api/schema/`.

Endpoints principais (implementados via `DefaultRouter` em `pokevault/urls.py`):

- **`/api/users/`** — `UserViewSet` (`accounts.views.UserViewSet`)
	- Métodos: `GET /`, `GET /<id>/`, `POST /`, `PUT/PATCH /<id>/`, `DELETE /<id>/`.
	- Permissões: **apenas** usuários com `role = 'GERENTE'` (perm: `IsGerente`).
	- Payload (exemplo criação): `{ "username": "user1", "email": "x@x.com", "first_name": "Nome", "last_name": "Sobrenome", "matricula": "123", "role": "ESTOQUISTA", "password": "senha" }`.

- **`/api/categorias/`** — `CategoriaViewSet` (`warehouse.views.CategoriaViewSet`)
	- CRUD de categorias (campo principal: `nome`, `descricao`).
	- Permissões: `IsAuthenticated`.

- **`/api/itens/`** — `ItemViewSet` (`warehouse.views.ItemViewSet`)
	- CRUD de itens.
	- Campos principais: `id`, `nome`, `categoria` (id), `quantidade`, `limite_minimo`, `preco_unitario`, `imagem` (upload), `created_at`.
	- Campos adicionais no serializer: `categoria_nome`, `status_estoque`.
	- Permissões: `IsAuthenticated`.
	- Rota custom: `GET /api/itens/estoque_baixo/` — retorna itens com `quantidade <= limite_minimo`.

- **`/api/transacoes/`** — `TransacaoViewSet` (`warehouse.views.TransacaoViewSet`)
	- Registra movimentações de estoque.
	- Campos: `id`, `tipo` (`ENTRADA` | `SAIDA`), `item` (id), `quantidade`, `usuario` (preenchido automaticamente no create), `data_hora`, `observacao`.
	- Permissões: `IsAuthenticated`.
	- Observação: ao criar (`POST /api/transacoes/`) o backend atribui `usuario` a partir do token do request (via `perform_create`).

Rotas adicionais (funções):
- `GET /api/dashboard/stats/` — retorna estatísticas rápidas: `total_itens`, `itens_criticos` (quantidade <= 10), `movimentacoes_hoje`.
- `POST /api/dashboard/ia-analysis/` — gera análise de tendências usando a função `gerar_analise_tendencias()` em `warehouse.services`. Requer permissão `IsGerente` além de autenticação.

**Modelos Principais**
- **`User` (accounts.models.User)**
	- Campos: `email` (único, usado como `USERNAME_FIELD`), `username`, `first_name`, `last_name`, `matricula` (único), `role` (`GERENTE` | `ESTOQUISTA`).

- **`Categoria` (warehouse.models.Categoria)**
	- Campos: `nome`, `descricao`.

- **`Item` (warehouse.models.Item)**
	- Campos: `nome`, `categoria` (FK para Categoria), `quantidade` (int), `limite_minimo` (int), `preco_unitario` (decimal), `imagem` (ImageField), `created_at`, `updated_at`.
	- Propriedade: `is_estoque_baixo` (True se `quantidade <= limite_minimo`).

- **`Transacao` (warehouse.models.Transacao)**
	- Campos: `item` (FK), `usuario` (FK para `AUTH_USER_MODEL`), `tipo` (`ENTRADA` | `SAIDA`), `quantidade`, `data_hora`, `observacao`.

**Fluxos e comportamento importante**
- Ao criar uma `Transacao` via API, o campo `usuario` é definido automaticamente como `request.user` (não enviar `usuario` no payload).
- Uploads de imagem: `Item.imagem` usa `MEDIA_ROOT` + `MEDIA_URL` conforme `pokevault/settings.py`. Em ambiente de desenvolvimento, sirva arquivos estáticos/media com `django` (ou configure um host/serviço para produção).
- Rota `analise_ia` depende de `GEMINI_API_KEY` e usa a biblioteca `google.generativeai` (veja `warehouse/services.py`). Se a chave não estiver configurada a função retorna `{"error": "API Key do Gemini não configurada."}`.

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

