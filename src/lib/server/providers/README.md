# Provider Abstraction Layer

This directory contains the **provider abstraction layer** that decouples the application from specific external services. Each provider wraps a single external service behind a stable function contract, allowing deployments to swap backends without modifying business logic.

## Architecture

```
Routes/Actions --> Services --> Repos (database abstraction)
                   Services --> Providers (external service abstraction)
```

The **repo layer** (`src/lib/server/repo/`) abstracts database access. The **provider layer** abstracts everything else: file storage and authentication.

## Provider Modules

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

Central module that re-exports provider functions. Storage and Auth providers use their default implementations.

## Implementing a Custom Provider

To swap an external service:

1. Create a new file in this directory (e.g., `minioStorageProvider.js`)
2. Export the same functions with identical signatures as the default provider
3. Update the import in `index.js` or the consuming service to use your implementation
