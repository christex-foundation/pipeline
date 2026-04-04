# User Journeys

This document describes the core user journeys for DPG Pipeline as defined by [PRD_V2.md](/Users/cf1/Github/pipeline/docs/PRD_V2.md).

It exists to answer:

- who the product is for
- what they are trying to achieve
- what the ideal end-to-end experience should look like

This file is intentionally user-flow focused. It should not replace the PRD, scope, roadmap, or technical design docs.

---

## Primary User Types

### 1. Project Creator

A maintainer or team member who wants to make an open-source project DPG-ready.

### 2. Contributor

A user who wants to help a project through GitHub-centered contribution.

### 3. Reviewer or Community Member

A user who wants to discover projects, assess credibility, follow progress, and leave useful feedback.

---

## Journey 1: Creator Launches a Project

### Goal

Get a project onto Pipeline with enough context for discovery, evaluation, and contribution.

### Trigger

A creator has an open-source project and wants public visibility plus DPG-readiness support.

### Happy Path

1. The creator signs in.
2. The creator creates a project.
3. The creator adds the project summary, GitHub repository, categories, and core metadata.
4. The project is published with a public project page.
5. The project appears in the explore feed.

### Expected Product Outcome

- the project has a public home on Pipeline
- GitHub is attached as the primary source of technical progress
- the project is ready for evaluation and discovery

### Key UX Expectations

- project creation should feel fast and credible
- GitHub repository input should feel central, not optional in spirit
- the creator should understand that publishing is the start of a DPG-readiness journey

---

## Journey 2: Creator Requests a DPG Evaluation

### Goal

Get a fresh, structured view of what is helping or blocking DPG readiness.

### Trigger

A creator wants to know the project’s current DPG-readiness status.

### Happy Path

1. The creator opens the project page.
2. The creator triggers a DPG evaluation from the UI.
3. The system runs the evaluator workflow.
4. The system stores the full markdown report.
5. The system stores parsed structured findings.
6. The project page updates to show the latest readiness state and report output.

### Expected Product Outcome

- the creator can see what criteria are passing or failing
- the creator can understand what to improve next
- the project page becomes a public readiness record

### Key UX Expectations

- evaluation should feel like a core product action, not an admin-only operation
- the result should be understandable at two levels:
  - quick summary
  - full report detail

---

## Journey 3: Project Reevaluation Happens After a Merged PR

### Goal

Keep DPG-readiness status in sync with real project progress on GitHub.

### Trigger

A relevant GitHub pull request is merged on a linked project repository.

### Happy Path

1. A PR is merged in the linked GitHub repository.
2. Pipeline receives the GitHub webhook event.
3. Pipeline triggers reevaluation for the project.
4. A new evaluation report is generated and stored.
5. The project page reflects the latest readiness state.

### Expected Product Outcome

- readiness status changes in response to real development progress
- the project page feels alive and trustworthy
- creators do not need to manually refresh every meaningful milestone

### Key UX Expectations

- the platform should make it obvious that GitHub progress drives readiness updates
- users should be able to tell when the latest evaluation was run

---

## Journey 4: Reviewer Discovers a Project Through Explore

### Goal

Quickly evaluate whether a project looks active, credible, and worth opening.

### Trigger

A user browses the explore feed to discover projects.

### Happy Path

1. The user opens explore.
2. The user sees a Product Hunt-style feed of projects.
3. Each project card shows enough signal to make a decision:
   - what the project is
   - DPG-readiness signal
   - GitHub activity or momentum signal
   - comment count
4. The user opens a project page that seems promising.

### Expected Product Outcome

- explore helps users discover projects through quality and momentum signals
- users can quickly identify which projects deserve deeper attention

### Key UX Expectations

- explore should feel like a launch/discovery product
- cards should reward activity, clarity, and public progress
- comment count should make social proof visible without moving discussion out of project pages

---

## Journey 5: Community Member Leaves Feedback on a Project

### Goal

Give a project useful public feedback that improves its positioning, credibility, or readiness.

### Trigger

A user opens a project page and has something valuable to say.

### Happy Path

1. The user reads the project page.
2. The user reviews the DPG-readiness status and recent GitHub activity.
3. The user leaves a comment or feedback on the project page.
4. The project page comment count increases and becomes visible in explore.

### Expected Product Outcome

- the project accumulates visible public feedback
- discussion becomes part of the project’s credibility loop
- creators can learn from public reaction and suggestions

### Key UX Expectations

- comments should feel attached to the project itself
- feedback should support project quality and readiness, not generic social chatter

---

## Journey 6: Contributor Finds a Concrete Way to Help

### Goal

Move from interest to useful GitHub-centered contribution.

### Trigger

A contributor wants to help a project on Pipeline.

### Happy Path

1. The contributor opens a project page.
2. The contributor sees GitHub issues, task signals, or readiness blockers.
3. The contributor identifies a concrete area to help.
4. The contributor follows the GitHub-centered contribution path.
5. The contribution helps move the project forward.

### Expected Product Outcome

- contribution is tied to real work
- readiness blockers can attract the right contributors
- Pipeline helps route contributor attention to useful GitHub work

### Key UX Expectations

- contribution actions should be concrete, not vague
- GitHub work should feel like the main path to helping

---

## Journey 7: Creator Signals Need for Support

### Goal

Communicate what support the project needs without turning Pipeline into a payments platform.

### Trigger

A creator wants to indicate that the project needs funding or other support.

### Happy Path

1. The creator updates project details to indicate support needs.
2. The project page shows that the project is seeking support.
3. Users understand the need, but Pipeline does not collect payment or act as intermediary.

### Expected Product Outcome

- support needs are visible
- the platform stays within scope
- expectations remain clear for both creators and community members

### Key UX Expectations

- support signaling must not imply that payments happen inside Pipeline
- the distinction between "needs funding" and "funding handled here" should be explicit

---

## Journey 8: Creator Uses the Project Page as a Public Readiness Record

### Goal

Use the project page as the canonical public narrative of progress toward DPG readiness.

### Trigger

A creator wants one place to point people to for status, progress, and credibility.

### Happy Path

1. The creator shares the project page publicly.
2. A visitor can understand:
   - what the project does
   - how active it is
   - what the current DPG-readiness state is
   - what feedback exists
   - how to help
3. The page becomes the public record of the project’s journey on Pipeline.

### Expected Product Outcome

- the project page becomes more than a profile
- it acts as an operating surface for public readiness progress

### Key UX Expectations

- the page should feel authoritative and current
- GitHub activity and evaluation data should increase trust

---

## Cross-Journey Product Principles

These principles should hold across all journeys:

### GitHub First

GitHub should remain the main technical source of truth for project movement.

### Readiness Over Vanity

The product should help teams become DPG-ready, not just look polished.

### Project Page as Canonical Surface

Discovery happens in explore, but understanding and interaction converge on the project page.

### Public Progress Matters

Visible progress, clear status, and transparent discussion should make projects more credible.

### Avoid Scope Drift

If a feature makes the platform look more like a payments product, sponsor network, or generic social network, it should be challenged before inclusion.

---

## Notes for Future Specs

If a journey becomes implementation-heavy, create a dedicated spec rather than expanding this file too much.

Likely future specs:

- evaluator integration workflow
- explore feed redesign
- project comments system
- evaluation artifact storage model
