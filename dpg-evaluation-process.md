---
title: dpg-evaluation-process

---

# DPG Evaluation System Overview

## Purpose

The evaluation system is designed to assess GitHub-hosted open-source projects against the **Digital Public Goods (DPG)** criteria at two key stages:

1. **Project creation**
1. **Pull Request (PR) merge events via GitHub Webhook**

The system uses GitHub APIs, AI-based evaluation with OpenAI, and job queuing with BullMQ to run evaluations asynchronously.

## Tools & Libraries Used

| Tool/Library  | Purpose |
| -------- | -------- |
| OpenAI API     | Evaluates projects against DPG criteria     |
|Zod | Schema validation of AI responses|
|Axios | HTTP client for interacting with GitHub API|
|BullMQ| Redis-based job queue for background evaluation jobs|
|GitHub Webhooks| Triggers evaluation jobs upon PR merges|

## Evaluation Logic

#### Step 1: Initial Evaluation on Project Creation

Function: `storeProject` (in `projectService.js`)

1. The user submits a project, which includes a GitHub URL.
1. After the project is saved and tagged:

    * A job is added to the `projectEvaluation` queue using BullMQ.
    * Job payload includes:
        * GitHub URL
        * Project ID
        * Supabase credentials

1. The job triggers the `evaluateProject` function (in `githubWebhookService.js`):

* The GitHub URL is parsed into `owner/repo`.
* Repository files are retrieved using `getAllRelevantFiles`.
* These are passed to OpenAI using a structured prompt to evaluate against 9 DPG criteria.
* The AI response is validated against a Zod schema (`DPGRecommendation`).
* The results are saved using `saveDPGStstatus`.

#### Step 2: Continuous Evaluation on GitHub Pull Request Merge

Function: `githubWebhook` (in `githubWebhookService.js`)

1. When a PR is merged, GitHub triggers a webhook.
1. The system:
    * Verifies the project exists using `getProjectByGithubUrl`.
    * Saves the PR metadata (author, commit count, timestamp) via `createProjectUpdate`.
    * Adds a new job to the `projectEvaluation` queue for re-evaluation.

1. Same `evaluateProject` flow is triggered as described in Step 1.

#### Evaluation Criteria (via OpenAI)

Each evaluation is based on the following **9 DPG** criteria:

1. **SDG Relevance**
1. **Open Licensing**
1. **Clear Ownership**
1. **Platform Independence**
1. **Documentation**
1. **Data Export Mechanism**
1. **Privacy Compliance**
1. **Standards & Best Practices**
1. **Do No Harm**

Each is scored `0` or `1`, with a reason and a final recommendation.

#### File Extraction

GitHub content is extracted via:

* `getRepoContributors`: To fetch contributor stats.
* `getAllRelevantFiles`: Recursively retrieves `.md` files and others (without extensions), capped to 2 directory levels deep.
* `getFileContent`: Decodes base64 file contents via GitHub API.

#### AI Evaluation Details

In `aiService.js`:

* Uses OpenAI's `gpt-4o` model.
* Schema validated with `zodResponseFormat`.
* The `checkDPGStatus` function coordinates:
  * Prompt generation
  * AI call
  * Parsing structured result

#### Webhook Payload Example

When a PR is merged, a payload like below is received:

```
{
  "action": "closed",
  "pull_request": {
    "merged": true,
    "title": "Improve documentation",
    "html_url": "...",
    "user": {...},
    "commits": 3,
    "merged_at": "2025-05-01T12:00:00Z"
  },
  "repository": {
    "html_url": "https://github.com/org/project"
  }
}
```

Summary

| Stage | Trigger | Evaluation |
| -------- | -------- | -------- |
| Create Project     | User action     | Queued via `storeProject`, evaluated using `evaluateProject`     |
|PR Merge | GitHub webhook| Queued via `githubWebhook`, evaluated again|

This modular and AI-driven design ensures ongoing compliance with DPG principles as projects evolve.
