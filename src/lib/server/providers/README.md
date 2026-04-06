# Provider Abstraction Layer

This directory contains the **provider abstraction layer** that decouples the application from specific external services. Each provider wraps a single external service behind a stable function contract, allowing deployments to swap backends without modifying business logic.

## Architecture

```
Routes/Actions --> Services --> Repos (database abstraction)
                   Services --> Providers (external service abstraction)
```

The **repo layer** (`src/lib/server/repo/`) abstracts database access. The **provider layer** abstracts everything else: AI, job queues, file storage, and authentication.

## Provider Modules

### AI Provider (`aiProvider.js`)

Wraps AI/LLM functionality for DPG evaluation and text embeddings.

**Default implementation**: OpenAI (`gpt-4o` for chat, `text-embedding-ada-002` for embeddings)

**Contract**:

- `chatCompletionWithSchema(messages, zodSchema, schemaName)` - Sends chat messages and returns structured output validated against a Zod schema
- `getEmbedding(text)` - Returns a numerical embedding vector for the input text

**Open-source alternatives**: Ollama, llama.cpp, Hugging Face Inference API, vLLM

### Storage Provider (`storageProvider.js`)

Wraps file storage for image uploads.

**Default implementation**: Supabase Storage

**Contract**:

- `uploadFile(bucket, path, file)` - Uploads a file and returns the upload result
- `getPublicUrl(bucket, path)` - Returns the public URL for a stored file
- `deleteFiles(bucket, paths)` - Deletes files by path

**Open-source alternatives**: MinIO (S3-compatible), SeaweedFS, local filesystem

### Auth Provider (`authProvider.js`)

Wraps authentication and session management.

**Default implementation**: Supabase Auth

**Contract**:

- `createUser({ email, password })` - Creates a new user account (admin operation)
- `deleteUser(userId)` - Deletes a user account (admin operation)
- `signInWithPassword(credentials, client)` - Signs in with email/password
- `signOut(client)` - Signs out the current user
- `createSessionClient(cookieHandlers)` - Creates a request-scoped auth client for SSR
- `getSessionAndUser(client)` - Validates session and returns `{ session, user }`

**Open-source alternatives**: Keycloak, Ory Kratos, SuperTokens, custom JWT with Passport.js

### Registry (`index.js`)

Central module that selects the active provider based on environment configuration. Currently:

- AI, Storage, and Auth providers use their default implementations

## Implementing a Custom Provider

To swap an external service:

1. Create a new file in this directory (e.g., `ollamaAiProvider.js`)
2. Export the same functions with identical signatures as the default provider
3. Update the import in `index.js` or the consuming service to use your implementation

Example: swapping OpenAI for Ollama

```javascript
// ollamaAiProvider.js
import Ollama from 'ollama';

export async function chatCompletionWithSchema(messages, zodSchema, schemaName) {
  const response = await ollama.chat({ model: 'llama3', messages });
  // Parse and validate response against zodSchema
  return {
    choices: [{ message: { parsed: zodSchema.parse(JSON.parse(response.message.content)) } }],
  };
}

export async function getEmbedding(text) {
  const response = await ollama.embeddings({ model: 'llama3', prompt: text });
  return response.embedding;
}
```
