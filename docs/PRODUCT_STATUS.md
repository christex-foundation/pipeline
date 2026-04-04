# Product Status

This document tracks how the current codebase aligns with the claims in [PRD_V2.md](/Users/cf1/Github/pipeline/docs/PRD_V2.md).

It is the audit layer for the product.

Use it to answer:

- what is already true in the codebase
- what is partially true
- what is still missing
- where the product is drifting from the PRD

This file should be updated whenever major product capabilities change.

---

## Status Labels

- `Implemented`: present in the product in a meaningful way
- `Partial`: present, but incomplete, inconsistent, or not yet product-grade
- `Missing`: not meaningfully implemented
- `Deferred`: intentionally excluded from current scope

---

## Capability Status

| Capability | Status | Notes |
| --- | --- | --- |
| Project creation and publishing | Implemented | Projects can be created, edited, and publicly viewed |
| Public project detail page | Implemented | Project pages exist and already combine overview, GitHub, and DPG status |
| DPG status visible on projects | Implemented | DPG status is already surfaced in the product |
| GitHub as project source of truth | Partial | GitHub is important in the product, but not yet consistently treated as the dominant progress signal everywhere |
| Manual evaluation trigger from UI | Missing | Core requirement not yet productized |
| Evaluation trigger on merged PR | Partial | Webhook flow exists, but current evaluator/report workflow is not yet fully aligned with the desired product path |
| Full markdown report storage | Missing | Target behavior is agreed, but not yet implemented as a first-class product capability |
| Parsed evaluation data storage | Partial | Structured DPG data exists, but it is not yet clearly modeled around the external evaluator report flow |
| Latest report visible on project page | Missing | Readiness state exists, but full evaluator report visibility is not yet in product |
| Product Hunt-style explore experience | Partial | Explore exists, but still feels closer to a project catalog than a launch/feed experience |
| Comment counts visible in explore | Missing | Desired behavior for redesigned explore |
| Project-page comments and feedback loop | Partial | Some update/comment primitives exist, but not yet the canonical product feedback loop |
| GitHub-centered contribution flow | Partial | Issues and contribution pathways exist, but should be tightened around readiness work |
| Funding signal without payments | Partial | Funding fields still exist in the model, but the product direction needs clearer non-payment semantics |
| Sponsor/institution workflows | Deferred | Explicitly moved out of current scope |
| Gamification systems | Deferred | Explicitly moved out of current scope |

---

## Update Rules

When updating this file:

1. Update status labels when implementation meaningfully changes.
2. Prefer changing notes over adding prose unless the product direction changed.
3. Keep this file aligned with the PRD, not with legacy feature ideas.
4. If a feature is intentionally removed from scope, mark it `Deferred` rather than leaving it ambiguous.
