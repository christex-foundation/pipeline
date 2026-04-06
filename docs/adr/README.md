# ADR Guide

## Purpose

Architectural Decision Records capture long-lived engineering decisions that should remain visible after a PR is merged.

They exist to reduce drift, make tradeoffs explicit, and give future contributors a stable record of why a pattern or boundary exists.

## When to Create an ADR

Create an ADR when a change:

- sets or changes a cross-cutting architectural direction
- establishes a reusable engineering rule or boundary
- introduces a pattern that future contributors are expected to follow
- chooses between meaningful alternatives with real tradeoffs
- is likely to be referenced in future implementation or review work

## When Not to Create an ADR

Do not create an ADR for:

- temporary planning notes
- one-off cleanup plans
- implementation checklists
- narrow feature specs that only matter for the current PR
- routine code changes that do not set a lasting architectural rule

If the document only exists to help execute one bounded change, put it in the PR description instead.

## Required Sections

Every ADR should include:

- title
- status
- date
- context
- decision
- alternatives considered
- consequences

Optional sections are allowed when useful:

- examples
- testing impact
- adoption notes
- migration notes

## Status Values

Use one of these statuses:

- `Proposed`
- `Accepted`
- `Rejected`
- `Superseded`

Use `Proposed` when the decision is under review.
Use `Accepted` when the decision is agreed, even if implementation is still incomplete.
Use `Superseded` when a newer ADR replaces it.

Implementation progress should usually be tracked in issues, PRs, or roadmap docs, not in the ADR status.

## Naming and Numbering

Use this filename pattern:

`0001-short-kebab-case-title.md`

Rules:

- use a 4-digit numeric prefix
- keep titles short and descriptive
- do not rename existing ADR numbers after merge
- create the next number in sequence

## Workflow

1. Decide whether the change is architectural.
2. Check whether an ADR already exists for that area.
3. If an ADR exists, follow it unless the task explicitly changes that decision.
4. If the code needs a different direction, update the existing ADR or add a new ADR that supersedes it.
5. If no ADR exists and the decision is long-lived, create a new ADR from `TEMPLATE.md`.
6. Reference the ADR in the PR when the implementation depends on it.

## How ADRs Should Be Used

- Routes, services, repositories, and other cross-cutting patterns should follow relevant accepted ADRs.
- Do not silently drift from an accepted ADR in implementation.
- If implementation reveals the ADR is wrong or incomplete, call that out directly and update the ADR.
- ADRs are the source of truth for architectural direction, not for feature scope or step-by-step execution.

## Relationship to PRs

- Use the PR description for bounded implementation specs by default.
- Use an ADR when the decision should outlive the current PR.
- A PR can implement an ADR, propose an ADR, or change an ADR.

## Template

Use [TEMPLATE.md](./TEMPLATE.md) when creating a new ADR.
