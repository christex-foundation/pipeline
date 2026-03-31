# Repository Layer (Database Abstraction)

The repo layer is the **database abstraction interface** for DPG Pipeline. Each repo file maps to one database table and exports functions with vendor-neutral signatures: plain JavaScript objects in, plain JavaScript objects out.

## Convention

Every repo function:

- Takes plain JS values as input parameters
- Receives the `supabase` database client as the **last parameter** (dependency injection)
- Returns plain JS objects or arrays
- Throws `Error` on failure

This means the repo layer insulates the rest of the application from the database implementation. To migrate from Supabase to a different PostgreSQL client (e.g., `pg`, Drizzle, Prisma), you would **only rewrite the repo files** while keeping identical function signatures.

## Repo Files

| File                          | Table                              | Key Operations                                            |
| ----------------------------- | ---------------------------------- | --------------------------------------------------------- |
| `projectRepo.js`              | `projects`                         | CRUD, search with `ilike`, pagination, relational queries |
| `userProfileRepo.js`          | `profile`                          | CRUD by user_id                                           |
| `authUserRepo.js`             | (auth provider)                    | User registration, login, logout, deletion                |
| `bookmarkRepo.js`             | `bookmark_project`                 | Add/remove bookmarks, list by user                        |
| `categoryRepo.js`             | `categories`, `category_project`   | Tag management, category-based project queries            |
| `dpgStatusRepo.js`            | `dpg_status`, `project_dpg_status` | DPG evaluation results                                    |
| `imageUploadRepo.js`          | (storage provider)                 | Image upload, deletion, URL generation                    |
| `memberRepo.js`               | `project_members`                  | Team member management                                    |
| `projectContributionsRepo.js` | `project_resource`                 | Resource/contribution tracking                            |
| `projectUpdatesRepo.js`       | `project_updates`                  | Project update posts                                      |
| `projectUpdateCommentRepo.js` | `project_update_comment`           | Comments on updates                                       |

## Example: Swapping to raw PostgreSQL

```javascript
// Current (Supabase):
export async function getProfile(userId, supabase) {
  const { data, error } = await supabase
    .from('profile')
    .select('name, bio, country, ...')
    .eq('user_id', userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Alternative (pg Pool):
export async function getProfile(userId, pool) {
  const { rows } = await pool.query(
    'SELECT name, bio, country, ... FROM profile WHERE user_id = $1',
    [userId],
  );
  if (!rows[0]) throw new Error('Profile not found');
  return rows[0];
}
```

Both implementations have the same signature and return the same shape of data. The service layer calling `getProfile()` would not need any changes.
