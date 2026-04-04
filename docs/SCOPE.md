# Scope and Acceptance Criteria

This document turns the current product definition into a stable evaluation baseline for the codebase.

It should be used when deciding:

- whether a feature is in scope
- whether a feature is complete
- whether a proposed change moves the product toward the intended outcome

The intended outcome is simple:

DPG Pipeline helps open-source projects become DPG-ready.

---

## Scope Rules

### A feature is in scope if it directly improves one or more of these:

- understanding DPG-readiness status
- showing GitHub-linked project progress
- discovering DPG-aspiring projects
- collecting useful project-page feedback
- helping contributors find GitHub-centered ways to assist

### A feature is out of scope if it primarily turns Pipeline into one of these:

- a payments platform
- a sponsorship marketplace
- a broad social platform
- a generic open-source directory with no DPG focus

---

## Canonical Product Surfaces

## 1. Explore

Purpose:

- help users discover projects
- communicate readiness and momentum quickly
- feel closer to Product Hunt than a static catalog

Acceptance criteria:

- projects are listed in a feed-oriented discovery format
- each project can surface DPG-readiness information
- each project can surface recent activity or momentum signals
- each project can show comment count
- discussion itself remains on the project page

## 2. Project Page

Purpose:

- act as the main public destination for a project
- centralize readiness, progress, and discussion

Acceptance criteria:

- project overview is visible
- GitHub repository context is visible
- readiness state is visible in structured form
- latest evaluator output is visible
- comments and feedback are visible on the page
- GitHub-centered contribution paths are visible

## 3. DPG Evaluation

Purpose:

- make readiness assessment explicit and actionable

Acceptance criteria:

- the user can request evaluation from the UI
- a relevant GitHub merged PR can trigger reevaluation
- the system stores the full markdown report
- the system stores parsed structured findings
- parsed findings update the project readiness display

## 4. Contribution

Purpose:

- help people contribute through GitHub-centered work

Acceptance criteria:

- users can find open issues or concrete GitHub-linked work
- users can express intent to help through a project workflow
- contribution flows reinforce readiness work rather than generic networking

---

## Required Product Capabilities

## Project Publication

Acceptance criteria:

- a logged-in creator can create a project
- the project can be publicly viewed
- the project can be edited by its owner
- the project includes a GitHub repository as a primary source of truth

## GitHub Activity as the Main Progress Signal

Acceptance criteria:

- project pages surface GitHub-derived activity
- project pages surface open GitHub issues or task context
- GitHub activity is treated as more important than manual social-style posting

## Comments and Feedback

Acceptance criteria:

- comments are attached to project pages
- explore shows comment counts only
- comments are part of the product’s public discovery and credibility loop

## Support Signaling Without Payments

Acceptance criteria:

- projects can indicate that they need support or funding
- the platform does not process transactions
- support signaling does not create payment or escrow expectations

---

## Data and Storage Expectations

The product should preserve both human-readable and machine-usable evaluation artifacts.

Acceptance criteria:

- full evaluator reports are stored in markdown form
- structured parsed findings are stored in a product-usable format
- the latest stored findings can drive the UI
- report storage supports display and later comparison

---

## Delivery Priorities

When deciding implementation order, use this priority stack:

1. evaluator trigger and report storage
2. project-page readiness and GitHub activity clarity
3. Product Hunt-style explore redesign
4. project-page comments and feedback loop
5. stronger GitHub-centered contribution workflows

---

## Explicitly Deferred

These should go to roadmap unless the scope is intentionally changed:

- payment rails
- crowdfunding
- sponsor and institution workflows
- advanced gamification
- blockchain rewards
- broad non-GitHub sourcing flows

---

## Evaluation Questions for Code Review

Use these questions to evaluate the codebase consistently:

1. Can a project be created, published, and understood as a DPG-readiness candidate?
2. Is GitHub clearly the primary progress signal for a project?
3. Can a DPG evaluation be triggered from the UI?
4. Can a merged PR trigger reevaluation automatically?
5. Are both markdown reports and parsed findings stored?
6. Does the project page clearly show the latest readiness state?
7. Does explore behave like a launch and discovery feed?
8. Do project pages contain the discussion and feedback loop?
9. Can contributors find GitHub-centered ways to help?
10. Does the platform avoid drifting into payments or sponsorship operations?

If the answer to these questions is mostly yes, the implementation is aligned with scope.
