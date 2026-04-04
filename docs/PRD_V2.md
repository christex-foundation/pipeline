# DPG Pipeline PRD v2

## Product Statement

DPG Pipeline is a platform that helps open-source projects become DPG-ready.

It gives teams a public launch surface, a structured DPG readiness workflow, GitHub-linked progress signals, actionable compliance reporting, and a way to receive community feedback and GitHub-centered contribution offers.

The platform does not process funding. It may allow projects to signal that they need funding, but its primary purpose is to help projects reach DPG Registry readiness.

---

## Core Thesis

Teams building open-source public-interest software often do not know:

- what the DPG Registry expects
- what is blocking their eligibility
- how to show progress publicly
- how to attract the right contributors to close the gaps

DPG Pipeline reduces that friction by combining:

- public project discovery
- DPG readiness tracking
- GitHub-driven progress signals
- structured compliance reports
- community feedback on project pages

---

## Product Vision

Create the default platform for teams that want to make an open-source project DPG-ready.

Someone should be able to visit a project on Pipeline and immediately understand:

- what the project is
- how active it is on GitHub
- how close it is to DPG readiness
- what is blocking it
- what work remains
- how they can help through GitHub-centered contribution

---

## Primary Users

### Project Creators

Maintainers of open-source projects that want to become eligible for the DPG Registry.

### Contributors

People who want to help projects close readiness gaps through GitHub-centered work such as issues, pull requests, documentation, and repo improvements.

### Reviewers and Community Members

People who want to discover promising projects, leave feedback, and monitor progress toward DPG readiness.

---

## Primary Job To Be Done

"As a project team, I want to understand what is blocking DPG readiness, see that status clearly, and get the right feedback and GitHub-centered contributions to move the project toward DPG Registry eligibility."

---

## Product Pillars

### 1. DPG Readiness Is the Center of the Product

Every major workflow should support the goal of helping projects become DPG-ready.

### 2. GitHub Is the Canonical Progress Signal

GitHub activity is the primary signal of project movement and progress.

### 3. Discovery Should Feel Like Product Hunt

The public discovery experience should feel like a launch and feedback platform, not a static directory.

### 4. Feedback Belongs on Project Pages

Projects should accumulate visible discussion, comments, and feedback on their own pages. Explore should surface comment counts, not host the discussions directly.

### 5. Funding Is Signaled, Not Processed

Projects may communicate that they need funding, but Pipeline does not act as a crowdfunding or payment platform.

### 6. Product Integrity Comes First

Pipeline should pursue DPG compliance without weakening the product or introducing scope that distracts from the core mission.

---

## Problem Statement

Current DPG-eligible or DPG-aspiring projects often lack a single product surface that combines:

- public launch and discovery
- GitHub-linked progress visibility
- structured DPG readiness checks
- actionable compliance reporting
- public feedback and contribution pathways

As a result, readiness work stays fragmented across GitHub, docs, internal knowledge, and ad hoc evaluations.

---

## Scope Summary

### In Scope

- public project launch pages
- Product Hunt-style explore/feed experience
- DPG readiness score and status for each project
- manual DPG evaluation trigger from the UI
- automatic DPG evaluation trigger from relevant GitHub events, especially merged PRs
- storage of both full markdown reports and parsed structured evaluation data
- GitHub-linked activity on project pages
- project-page comments and feedback
- GitHub-centered contribution flows
- project support signals, including funding needed, without payment handling
- manual project updates, with GitHub activity treated as the primary progress signal

### Out of Scope

- payment processing
- crowdfunding mechanics
- sponsor and institutional workflows
- talent marketplace workflows outside GitHub contribution
- blockchain or tokenized rewards
- broad gamification systems
- social media ingestion outside GitHub
- full DPG Registry submission handling unless explicitly added later

### Deferred to Roadmap

- sponsor and institution profiles
- large gamification and leaderboard systems
- funding rails
- non-GitHub collaboration sourcing

---

## Core Product Surfaces

## 1. Explore

A Product Hunt-style feed where projects can be discovered and compared.

The explore experience should surface:

- project title and summary
- DPG readiness signal
- recent GitHub activity signal
- launch and recency context
- comment count
- support-needed indicators

Explore is a discovery surface, not the primary place for discussion.

## 2. Project Page

The project page is the canonical public record of a project’s DPG-readiness journey.

It should combine:

- project overview
- GitHub repository context
- recent GitHub activity
- DPG readiness status
- latest evaluation report
- comments and community feedback
- open GitHub issues or tasks
- contribution entry points
- support-needed signals

## 3. DPG Evaluation

DPG evaluation is a first-class workflow, not a background implementation detail.

The product must let users:

- request an evaluation from the UI
- see whether an evaluation is in progress
- view the latest report
- understand the parsed structured findings
- see readiness status updated from evaluation output

## 4. Contribution

Contribution is GitHub-centered.

The platform should help contributors identify concrete ways to help through:

- open issues
- repo-level work
- DPG-readiness-related tasks inferred from evaluation output

---

## Functional Requirements

### Project Creation and Publishing

1. A creator can submit a project with GitHub repository, summary, categories, and DPG-relevant metadata.
2. A project can be published and publicly viewed.
3. A project page clearly communicates its current DPG-readiness state.

### Explore and Discovery

4. The explore page presents projects in a Product Hunt-style feed.
5. The explore page shows project-level comment counts.
6. The explore page surfaces readiness and momentum signals.
7. Users can discover projects by recency, readiness, and activity.

### DPG Evaluation

8. A user can manually trigger a DPG evaluation from the UI.
9. A merged PR on GitHub can automatically trigger a DPG evaluation for linked projects.
10. The system stores the full evaluation report as markdown.
11. The system stores parsed structured evaluation data suitable for product rendering.
12. The latest evaluation result updates the project’s DPG readiness view.

### GitHub Activity

13. GitHub is the primary source of progress and activity signals on project pages.
14. Project pages display recent GitHub-derived activity and open issues.
15. GitHub activity should be more prominent than manual updates in the project narrative.

### Comments and Feedback

16. Users can leave comments and product-style feedback on project pages.
17. Project pages show the discussion history for that project.
18. Explore shows discussion counts but does not host full conversations.

### Contribution

19. Users can find concrete GitHub-centered ways to help a project.
20. Projects can receive support offers tied to GitHub-centered contribution.

### Support Signaling

21. Projects can indicate that they need funding or support.
22. Pipeline does not process, collect, hold, or transfer funds.

---

## Evaluator Integration

The existing evaluator workflow at `~/Github/dpg-evaluator` is currently the source of truth for compliance reporting.

Until that capability is fully internalized into Pipeline, the product must support integration with this evaluator flow.

### Required Behavior

- manual trigger from the Pipeline UI
- automatic trigger from GitHub merged PR events
- persisted storage of full markdown reports
- persisted storage of parsed structured findings
- readiness status derived from evaluator output
- display of the latest report on the project page

### Product Requirement

The evaluator should not remain a hidden operator workflow. It must become an explicit product capability accessible from the UI and GitHub automation.

---

## Success Metrics

- number of projects with a valid GitHub repository
- number of projects with at least one generated DPG report
- time from project creation to first DPG evaluation
- number of projects with improving readiness over time
- number of merged PRs that trigger reevaluation
- number of comments and feedback interactions on project pages
- number of contributor actions originating from GitHub-linked work
- number of projects that reach DPG-ready status

---

## Definition of Product Success

Pipeline is successful when it helps teams move from "we have an open-source project" to "we understand our DPG gaps, can show our progress publicly, and know what work remains to become DPG-ready."

---

## Positioning

### One-Sentence Product Definition

DPG Pipeline is a platform to help open projects become DPG-ready.

### What It Is Not

It is not:

- a crowdfunding platform
- a sponsor marketplace
- a general social network for projects
- a generic open-source directory without a DPG-readiness workflow

---

## Roadmap Themes

These are explicitly not part of the current product definition, but may be revisited later:

- sponsor and institutional workflows
- expanded gamification
- advanced reputation systems
- funding rails
- non-GitHub contribution ecosystems

