//@ts-check
import { z } from 'zod';

export const repoParamsSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export const createIssueSchema = repoParamsSchema.extend({
  title: z.string().min(1).max(256),
  body: z.string().max(65536).optional(),
  labels: z.array(z.string()).optional(),
  assignees: z.array(z.string()).optional(),
});

export const updateIssueSchema = repoParamsSchema.extend({
  issue_number: z.number().int().positive(),
  state: z.enum(['open', 'closed']),
});

export const listIssuesSchema = repoParamsSchema.extend({
  state: z.enum(['open', 'closed', 'all']).optional().default('open'),
  page: z.number().int().positive().optional().default(1),
  per_page: z.number().int().positive().max(100).optional().default(30),
});

export const createPullRequestSchema = repoParamsSchema.extend({
  title: z.string().min(1).max(256),
  body: z.string().max(65536).optional(),
  head: z.string().min(1),
  base: z.string().min(1),
  draft: z.boolean().optional(),
});

export const updatePullRequestSchema = repoParamsSchema.extend({
  pull_number: z.number().int().positive(),
  state: z.enum(['open', 'closed']),
});

export const mergePullRequestSchema = repoParamsSchema.extend({
  pull_number: z.number().int().positive(),
  merge_method: z.enum(['merge', 'squash', 'rebase']).optional(),
  commit_title: z.string().max(256).optional(),
  commit_message: z.string().max(65536).optional(),
});

export const listPullRequestsSchema = repoParamsSchema.extend({
  state: z.enum(['open', 'closed', 'all']).optional().default('open'),
  page: z.number().int().positive().optional().default(1),
  per_page: z.number().int().positive().max(100).optional().default(30),
});
