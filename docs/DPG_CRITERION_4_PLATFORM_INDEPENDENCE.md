# DPG Criterion 4: Platform Independence

## Overview

**DPG Requirement**: Your digital solution must disclose its mandatory dependencies or assets (i.e. libraries, software, or hardware) which may create more restrictions than the original license. Applicants must provide a description of how open-source components are independent and/or list the open alternatives for any closed component(s).

## Platform Independence Analysis

### Core Technology Independence

DPG Pipeline is built using **web-based technologies** that ensure maximum platform independence:

- **Web Standards**: Built on open web standards (HTML, CSS, JavaScript)
- **Cross-Platform**: Runs on any device with a modern web browser
- **Server Agnostic**: Can be deployed on any server environment supporting Node.js
- **Database Portable**: Uses standard SQL (PostgreSQL) with migration support

### Architecture Independence

DPG Pipeline uses a **layered abstraction architecture** that decouples business logic from external service implementations:

```
┌─────────────────────────────────────────────────────┐
│                 Web Browser                         │
│              (Any Platform)                         │
├─────────────────────────────────────────────────────┤
│              SvelteKit Frontend                     │
│           (Standard Web Technologies)               │
├─────────────────────────────────────────────────────┤
│                REST API Layer                       │
│            (HTTP/HTTPS Standards)                   │
├─────────────────────────────────────────────────────┤
│            Service Layer (Business Logic)           │
│                                                     │
│  ┌──────────────┐     ┌──────────────────────────┐ │
│  │  Repo Layer   │     │   Provider Layer          │ │
│  │  (Database    │     │   (AI, Queue, Storage,   │ │
│  │   Abstraction)│     │    Auth Abstraction)     │ │
│  └──────┬───────┘     └──────────┬───────────────┘ │
├─────────┼────────────────────────┼─────────────────┤
│         ▼                        ▼                  │
│   PostgreSQL              External Services         │
│   (Standard SQL)     (Swappable via Providers)      │
└─────────────────────────────────────────────────────┘
```

**Two abstraction layers** ensure platform independence:

1. **Repository Layer** (`src/lib/server/repo/`) — All database access goes through repo functions with vendor-neutral signatures. Each function takes plain JavaScript objects and returns plain JavaScript objects, with the database client injected as a parameter. See `src/lib/server/repo/README.md`.

2. **Provider Layer** (`src/lib/server/providers/`) — All external service calls (AI, job queues, file storage, authentication) go through provider modules with documented function contracts. See `src/lib/server/providers/README.md`.

## Mandatory Dependencies Analysis

### Runtime Dependencies

#### Open Source Runtime Dependencies
All core runtime dependencies are open source with permissive licenses:

| Dependency | License | Platform Independent | Open Alternative |
|------------|---------|---------------------|------------------|
| **Node.js** | MIT | Yes, cross-platform | Self (open source) |
| **SvelteKit** | MIT | Yes, web standards | Self (open source) |
| **PostgreSQL** | PostgreSQL License | Yes, cross-platform | Self (open source) |
| **Vite** | MIT | Yes, Node.js based | Self (open source) |

#### Critical Analysis: No Vendor Lock-in
- **Frontend**: Standard web technologies, no proprietary frameworks
- **Backend**: Standard Node.js, deployable on any compatible server
- **Database**: Standard PostgreSQL, compatible with many hosting providers
- **Build Tools**: Open source build tools with cross-platform support

### External Service Dependencies

#### Current External Services

| Service | Type | Dependency Level | Open Alternative | Migration Effort |
|---------|------|-----------------|------------------|------------------|
| **Supabase** | BaaS (DB + Auth + Storage) | High | Self-hosted PostgreSQL + Keycloak + MinIO | Medium |
| **OpenAI** | AI/LLM API | High | Ollama, llama.cpp, Hugging Face Inference, vLLM | Medium |
| **Redis** | Job Queue Backend | Medium (optional) | In-memory queue (included), pgBoss, bee-queue | Low |
| **Vercel** | Hosting | Low | Any Node.js hosting | Low |
| **GitHub** | Code hosting + API | Low | GitLab, Gitea, Codeberg | Low |
| **Sentry** | Error tracking | Low (unused) | Self-hosted Sentry, GlitchTip | Low |

#### Service Independence Measures

**1. Supabase (Database, Auth & Storage)**
- **Dependency Level**: High (current default implementation)
- **Abstraction**: Database access isolated in repo layer (`src/lib/server/repo/`); auth and storage isolated in provider layer (`src/lib/server/providers/authProvider.js`, `storageProvider.js`)
- **Open Alternatives**: Self-hosted PostgreSQL + Keycloak/Ory/SuperTokens for auth + MinIO for storage
- **Migration Path**: Reimplement repo files for database, swap provider modules for auth/storage

**2. OpenAI (AI Evaluation & Embeddings)**
- **Dependency Level**: High (used for DPG status evaluation and project similarity)
- **Abstraction**: All AI calls go through `src/lib/server/providers/aiProvider.js` with two functions: `chatCompletionWithSchema()` and `getEmbedding()`
- **Open Alternatives**: Ollama (local LLMs), llama.cpp, Hugging Face Inference API, vLLM
- **Migration Path**: Implement a new provider file with the same function signatures, update the import

**3. Redis / BullMQ (Job Queue)**
- **Dependency Level**: Medium (optional — application works without it)
- **Abstraction**: Queue operations go through `src/lib/server/providers/queueProvider.js` or `inMemoryQueue.js`
- **Built-in Alternative**: In-memory queue fallback is included and auto-selected when Redis is not configured
- **Migration Path**: Already handled — no Redis required for deployment

**4. Vercel (Hosting)**
- **Dependency Level**: Low (deployment only)
- **Open Alternative**: Any Node.js compatible hosting
- **Migration Path**: Standard deployment process; uses `@sveltejs/adapter-auto`
- **Effort**: Low complexity migration

**5. GitHub (Version Control & API)**
- **Dependency Level**: Low (development workflow + repo data fetching)
- **Open Alternative**: GitLab, Gitea, Codeberg
- **Migration Path**: Git repository migration + update API endpoints in `src/lib/server/github.js`
- **Effort**: Low complexity migration

## Provider Configuration

External services are configured via environment variables:

| Variable | Service | Required | Default |
|----------|---------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase | Yes | - |
| `VITE_SUPERBASE_ANON_KEY` | Supabase | Yes | - |
| `PRIVATE_SUPABASE_SERVICE_KEY` | Supabase Auth (admin) | Yes | - |
| `PRIVATE_OPENAI_API_KEY` | OpenAI | Yes (for AI features) | - |
| `PRIVATE_GITHUB_TOKEN` | GitHub API | No (improves rate limits) | - |
| `REDIS_HOST` | Redis/BullMQ | No | Falls back to in-memory queue |
| `REDIS_PORT` | Redis/BullMQ | No | - |
| `REDIS_PASSWORD` | Redis/BullMQ | No | - |

When `REDIS_HOST` is not set, the application automatically uses the in-memory queue provider, enabling deployment without Redis infrastructure.

## Open Source Alternative Implementation

### Database Independence

The **repository layer** (`src/lib/server/repo/`) provides the database abstraction. Each repo function has a vendor-neutral signature — to swap from Supabase to raw PostgreSQL:

```javascript
// Current implementation (Supabase query builder):
export async function getProfile(userId, supabase) {
  const { data, error } = await supabase
    .from('profile').select('name, bio, country, ...').eq('user_id', userId).single();
  if (error) throw new Error(error.message);
  return data;
}

// Alternative implementation (pg Pool):
export async function getProfile(userId, pool) {
  const { rows } = await pool.query(
    'SELECT name, bio, country, ... FROM profile WHERE user_id = $1', [userId]
  );
  if (!rows[0]) throw new Error('Profile not found');
  return rows[0];
}
```

The service layer calling `getProfile()` requires no changes — both implementations have the same signature and return shape.

### Authentication Independence

Auth is abstracted in `src/lib/server/providers/authProvider.js`:

```javascript
// To swap to Keycloak or custom JWT, reimplement these functions:
export async function createUser({ email, password }) { /* ... */ }
export async function deleteUser(userId) { /* ... */ }
export async function signInWithPassword(credentials, client) { /* ... */ }
export async function signOut(client) { /* ... */ }
export async function createSessionClient(cookieHandlers) { /* ... */ }
export async function getSessionAndUser(client) { /* ... */ }
```

### AI Independence

AI is abstracted in `src/lib/server/providers/aiProvider.js`:

```javascript
// To swap to Ollama or another LLM provider, reimplement these functions:
export async function chatCompletionWithSchema(messages, zodSchema, schemaName) { /* ... */ }
export async function getEmbedding(text) { /* ... */ }
```

### File Storage Independence

Storage is abstracted in `src/lib/server/providers/storageProvider.js`:

```javascript
// To swap to MinIO or local filesystem, reimplement these functions:
export async function uploadFile(bucket, path, file) { /* ... */ }
export function getPublicUrl(bucket, path) { /* ... */ }
export async function deleteFiles(bucket, paths) { /* ... */ }
```

### Hosting Independence
**Current Deployment**: Vercel (via `@sveltejs/adapter-auto`)
**Alternative Options**:
- **Self-hosted**: Any VPS with Node.js support
- **Open Source PaaS**: Dokku, CapRover
- **Cloud Providers**: Any provider supporting Node.js applications
- **Container Deployment**: Docker on any container platform

## Hardware and System Requirements

### Minimum System Requirements
- **Server**: Any system capable of running Node.js 20+
- **Memory**: 512MB RAM minimum, 1GB recommended
- **Storage**: 1GB for application, additional for database
- **Network**: Standard HTTP/HTTPS internet connectivity

### Client Requirements
- **Browser**: Any modern web browser (Chrome, Firefox, Safari, Edge)
- **Device**: Desktop, tablet, or mobile device
- **Network**: Standard internet connection
- **No Special Software**: No plugins or special software required

### Platform Compatibility
- **Operating Systems**: Windows, macOS, Linux, Unix-based systems
- **Architectures**: x86, x64, ARM (via Node.js support)
- **Containers**: Docker support for easy deployment
- **Cloud Platforms**: AWS, GCP, Azure, DigitalOcean, Linode, etc.

## Self-Hosting Documentation

### Docker Deployment
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose for Complete Stack
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/pipeline
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=pipeline
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Open Source Alternatives Documentation

### Complete Open Source Stack

| Component | Current Solution | Open Source Alternative | Implementation Effort |
|-----------|------------------|-------------------------|----------------------|
| **Frontend** | SvelteKit | Already open source | N/A |
| **Backend** | Node.js | Already open source | N/A |
| **Database** | Supabase (PostgreSQL) | PostgreSQL (direct) | Low — rewrite repo files |
| **Authentication** | Supabase Auth | Keycloak, Ory, SuperTokens | Medium — swap auth provider |
| **File Storage** | Supabase Storage | MinIO, local filesystem | Low — swap storage provider |
| **AI Evaluation** | OpenAI GPT-4o | Ollama, llama.cpp, vLLM | Medium — swap AI provider |
| **Job Queue** | BullMQ (Redis) | In-memory (included), pgBoss | Low — auto-fallback included |
| **Monitoring** | Sentry (unused) | GlitchTip, self-hosted Sentry | Low |

## Risk Assessment and Mitigation

### Vendor Lock-in Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|---------|------------|
| **Supabase Service Changes** | Medium | Medium | Repo layer abstracts DB; auth/storage providers are swappable |
| **OpenAI API Changes/Pricing** | Medium | Medium | AI provider abstraction; open-source LLM alternatives documented |
| **Redis Unavailability** | Low | Low | In-memory queue fallback included and auto-selected |
| **Vercel Hosting Issues** | Low | Low | Uses adapter-auto; deployable anywhere |
| **GitHub Service Issues** | Low | Low | Git repository easily portable |
| **Node.js Ecosystem Changes** | Low | Low | Standard web technologies as fallback |

### Mitigation Strategies
1. **Abstraction Layers**: Provider and repo layers ensure services can be swapped by reimplementing a single file
2. **Built-in Fallbacks**: In-memory queue works without Redis infrastructure
3. **Documentation**: Provider contracts documented in `src/lib/server/providers/README.md`
4. **Regular Migration Testing**: Quarterly testing of migration procedures
5. **Community Engagement**: Active participation in open source alternatives

## Conclusion

DPG Pipeline demonstrates strong platform independence through:

1. **Abstraction Layers**: Two-tier abstraction (repo layer for database, provider layer for external services) ensures no single vendor lock-in
2. **Open Source Foundation**: Built entirely on open source technologies with permissive licenses
3. **Web Standards**: Uses standard web technologies ensuring broad compatibility
4. **Built-in Fallbacks**: In-memory queue included for Redis-free deployment
5. **Documented Contracts**: Every provider has a documented function contract enabling alternative implementations
6. **Complete Disclosure**: All 6 external service dependencies are documented with open alternatives and migration paths

The platform can be fully deployed and operated using only open source components, ensuring true platform independence and avoiding vendor lock-in.

---

*This document serves as evidence for DPG Criterion 4 compliance and provides comprehensive guidance for platform-independent deployment and operation.*
