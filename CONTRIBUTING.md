# Contributing to Pipeline

Thank you for your interest in contributing to Pipeline! We welcome contributions from everyone. This document outlines the process for contributing to this project.

## Getting Started

1. Clone/Fork the repository on GitHub.
2. Create a new branch for your contribution.

## Making Changes

1. Make your changes in your branch.
2. Write or update tests as necessary.
3. Ensure your code follows the project's coding style and conventions.
4. Run the tests to make sure everything passes.

## Submitting Changes

1. Push your changes to your fork on GitHub.
2. Open a pull request against the main repository.
3. Provide a clear description of your changes in the PR description.

## Pull Request Guidelines

- Keep PRs small and focused on a single issue or feature.
- Ensure your code is well-documented and includes appropriate comments.
- Update relevant documentation if necessary.
- Be responsive to feedback and be willing to make changes if requested.

## Coding Conventions

- Follow the existing code style in the project.
- Use meaningful variable and function names.
- Write clear, concise comments.
- Keep functions small and focused on a single task.

## Supabase Guide For Tables

- Create your supabase project with the [Supabase setup guide](https://supabase.com/docs/guides/getting-started),
- Select the **Database** tab on the sidebar
- Select on **Tables**
- Click on **New Table** and add the following tables with their fields _(leave the default fields untouched)_:

> Table Name: projects

| Name           | Type | Default Value     | Primary | Is Unique | Nullable | Define As Array |
| -------------- | ---- | ----------------- | ------- | --------- | -------- | --------------- |
| id             | uuid | gen_random_uuid() | Yes     | True      |          |                 |
| title          | text |                   |         |           |          |                 |
| bio            | text |                   |         |           |          |                 |
| tags           | text |                   |         |           |          | Yes             |
| country        | text |                   |         |           |          |                 |
| details        | text |                   |         |           |          |                 |
| email          | text |                   |         | True      |          |                 |
| portfolio      | text |                   |         | True      |          |                 |
| github_repo    | text |                   |         | True      |          |                 |
| linkedin       | text |                   |         | True      |          |                 |
| twitter        | text |                   |         | True      |          |                 |
| website        | text |                   |         | True      |          |                 |
| other          | text |                   |         |           |          |                 |
| bank_acct      | text |                   |         | True      |          |                 |
| wallet_address | text |                   |         | True      |          |                 |
| funding_goal   | text |                   |         |           |          |                 |

## Reporting Issues

If you find a bug or have a suggestion for improvement:

1. Check if the issue already exists in the GitHub issue tracker.
2. If not, create a new issue with a clear description and steps to reproduce (for bugs).

## Questions?

If you have any questions about contributing, feel free to ask in the project's communication channels or open an issue for clarification.

Thank you for contributing to Pipeline!
