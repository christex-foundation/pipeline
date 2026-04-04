# DPG Evaluation Report: Pipeline

## Score Callout

> Score: 8/9 - Approval Likelihood: MEDIUM
>
> Pipeline is close to DPG readiness. The main blocker is Criterion 9, where the platform needs explicit abuse reporting, moderation, and repo-level safety governance to match its user-generated content and contribution flows.

---

## Project Overview

| Field | Value |
| --- | --- |
| Project | Pipeline |
| Repository | [https://github.com/christex-foundation/pipeline](https://github.com/christex-foundation/pipeline) |
| Country | Sierra Leone |
| Website | [https://pipeline-tau.vercel.app](https://pipeline-tau.vercel.app) |
| Evaluated | 2026-04-04 |
| Version | v2 - deep code analysis |

---

## Executive Summary

Pipeline demonstrates strong DPG readiness across licensing, ownership, platform independence, documentation, data extraction, privacy/legal compliance, and general engineering practices. The repository implements a real DPG workflow platform with project creation, SDG-linked categorization, contribution tracking, export mechanisms, and GitHub-triggered DPG evaluation jobs.

The main gap is not legal or technical openness. It is operational safety. Because Pipeline includes user-generated content and contribution flows, it needs explicit abuse reporting, moderation, and governance/security artifacts before it can credibly claim "Do No Harm by Design."

---

## Scope & Registry Analysis

**Primary function:** A web platform for hosting DPG project profiles, tracking progress/compliance, coordinating contributions, and automatically evaluating linked GitHub repositories against the 9 DPG criteria.

**Unique value:** The differentiator is the DPG-specific workflow built into the product itself: SDG tagging, DPG compliance tracking, and GitHub PR-triggered re-evaluation.

**Existing coverage:** The registry already contains aid, donor-management, and public digital infrastructure platforms, so this space is not empty. What is less common is a product focused specifically on helping other DPGs become and remain compliant.

**Overlap risk:** MEDIUM

**Strongest approval angle:** Pipeline can be framed as SDG-aligned digital infrastructure that lowers the coordination and compliance cost for many other Digital Public Goods.

### SDG Alignment - Code-Derived

- **SDG 17** (STRONG): The application stores and exposes collaboration primitives for projects, members, contributions, and updates, supporting partnerships around DPG work.
- **SDG 9** (MODERATE): The system implements digital infrastructure for project evaluation and coordination, including queue-backed GitHub evaluation workflows and provider abstractions.
- **SDG 16** (MODERATE): Transparency and accountability are supported through updates, comments, export endpoints, and SDG-linked categorization.

---

## Score Card

| Criterion | Score | Summary |
| --- | --- | --- |
| SDG Relevance | ✅ PASS | Real SDG-linked collaboration and evaluation workflows exist in code |
| Open Licensing | ✅ PASS | Complete MIT license with identifiable copyright holder |
| Clear Ownership | ✅ PASS | Christex Foundation ownership is public and attributable |
| Platform Independence | ✅ PASS | External services are abstracted behind provider and repo layers |
| Documentation | ✅ PASS | README and docs are substantial and match core implementation |
| Data Extraction | ✅ PASS | User and project exports exist in JSON, CSV, and XML |
| Privacy & Legal Compliance | ✅ PASS | Privacy/legal pages plus export and account deletion are implemented |
| Standards & Best Practices | ✅ PASS | Tests, CI, lockfiles, CSP/CSRF, and structured architecture exist |
| Do No Harm | ❌ FAIL | No clear moderation, abuse reporting, or safety governance workflow |

---

## Priority Actions

### Critical

1. **Add abuse reporting and moderation workflows** for project updates, comments, and contribution flows. Effort: medium. Criterion 9.

### High Priority

1. **Add `CODE_OF_CONDUCT`, `SECURITY.md`, and `GOVERNANCE.md`** to formalize safety, disclosure, and accountability. Effort: low. Criteria 3 and 9.
2. **Add `CODEOWNERS` and a clearer maintainer model** to reduce governance ambiguity and bus-factor risk. Effort: low. Criterion 3.
3. **Tighten CI to run `npm run test` and `npm run check`** and add lint enforcement. Effort: low to medium. Criterion 8.

### Medium Priority

1. **Make provider switching more configuration-driven** so AI provider swaps do not require code edits. Effort: medium. Criterion 4.
2. **Add a production deployment guide and ops runbook** for non-Supabase or more portable deployments. Effort: medium. Criterion 5.
3. **Document export schemas and PII classification** for user and project export payloads. Effort: medium. Criteria 6 and 7.

---

## Timeline to DPG Readiness

> Estimated timeline: 6 weeks. Current likelihood: MEDIUM -> Projected likelihood after fixes: HIGH.

1. **Weeks 1-2:** Add `CODE_OF_CONDUCT`, `SECURITY.md`, `GOVERNANCE.md`, and an abuse reporting channel. Ship basic throttling and validation improvements on comment and contribution endpoints.
2. **Weeks 3-4:** Implement moderation primitives such as report review, hide/delete actions, and admin handling for flagged content. Add `CODEOWNERS`, expand CI to run tests and type checks, and add linting.
3. **Weeks 5-6:** Publish a stronger deployment guide, document provider swap paths, run a focused security review of auth/exports/webhooks, and prepare the updated DPG submission evidence set.

---

## Detailed Criterion Analysis

<details>
<summary><strong>✅ Criterion 1: SDG Relevance</strong></summary>

**Finding:** Pipeline has real SDG-linked functionality in code. The schema includes `categories.sdg_id`, and the platform implements projects, contributions, updates, members, and evaluation workflows rather than just describing them.

**Recommendation:** Add one explicit, measurable SDG reporting workflow so the platform can show not only relevance but concrete outcome tracking for SDG-aligned activity.

*Peer comparison:* Platforms like Aid Management Platform and PotLock tie their workflows directly to public-good outcomes. Pipeline should emphasize that it accelerates many other DPGs, which is a strong SDG 17 angle rather than trying to look like a general donor platform.

</details>

<details>
<summary><strong>✅ Criterion 2: Open Licensing</strong></summary>

**Finding:** The repository contains a complete MIT license with `Copyright (c) 2024 Christex Foundation`, which is sufficient for DPG open-license compliance.

**Recommendation:** Add a `license` field in `package.json` and consider a short notice about third-party license review for extra clarity.

*Peer comparison:* Approved DPGs commonly use MIT, Apache-2.0, GPL, or AGPL. MIT is acceptable and low-friction for reuse.

</details>

<details>
<summary><strong>✅ Criterion 3: Clear Ownership</strong></summary>

**Finding:** Ownership is attributable to Christex Foundation through the license and legal pages, and the legal pages provide a public contact address.

**Recommendation:** Add `GOVERNANCE.md` and `CODEOWNERS` so repository ownership, decision-making, and escalation are explicit at the codebase level, not only in legal pages.

*Peer comparison:* Strong registry projects usually pair copyright clarity with maintainer and governance documentation. Pipeline has the legal side already but should make governance more operational.

</details>

<details>
<summary><strong>✅ Criterion 4: Platform Independence</strong></summary>

**Finding:** The codebase uses provider and repository abstraction layers, and the queue provider already falls back to in-memory operation when Redis is unavailable. This materially reduces lock-in risk.

**Recommendation:** Make provider choice fully environment-driven for AI and document non-Supabase deployment options more concretely.

*Peer comparison:* Mature DPGs in this area document open alternatives for hosted dependencies. Pipeline’s architecture is aligned with that model; the remaining work is mainly documentation and configuration.

</details>

<details>
<summary><strong>✅ Criterion 5: Documentation</strong></summary>

**Finding:** The repository includes a detailed README, setup guidance, DB setup documentation, and criterion-specific docs. Core documented features like data export and legal pages are backed by actual implementation.

**Recommendation:** Add a production deployment guide and a concise operator runbook for setup, maintenance, and recovery.

*Peer comparison:* Approved DPGs with strong documentation usually include both developer setup and deployment/operations guidance. Pipeline is strong on the first and lighter on the second.

</details>

<details>
<summary><strong>✅ Criterion 6: Data Extraction</strong></summary>

**Finding:** Pipeline stores user and project data and implements export flows for both. User exports and project exports support JSON, CSV, and XML, with rate limiting, record caps, and scoped access.

**Recommendation:** Document exported fields and their privacy classification so operators can distinguish user-copy exports from safe non-PII reporting exports.

*Peer comparison:* Data-focused DPGs like CKAN distinguish themselves through mature export and API patterns. Pipeline has the mechanics and should now improve the documentation around them.

</details>

<details>
<summary><strong>✅ Criterion 7: Privacy &amp; Legal Compliance</strong></summary>

**Finding:** Privacy policy, terms, cookie policy, and DPA pages exist in the product, and the code implements user rights through data export and account deletion. CSP and CSRF protections are configured at the framework level.

**Recommendation:** Add a repo-level `SECURITY.md` and mirror processor/vendor documentation in the repository so privacy/security evidence is not only embedded in UI pages.

*Peer comparison:* Approved DPGs generally combine public legal policies with implemented user rights. Pipeline already does this well and mainly needs stronger repository-level evidence organization.

</details>

<details>
<summary><strong>✅ Criterion 8: Standards &amp; Best Practices</strong></summary>

**Finding:** The codebase includes tests, CI, dependency lockfiles, type checking, structured architecture, and open-format exports. Security posture is further supported by CSP and CSRF settings.

**Recommendation:** Enforce unit tests and type checks in CI, add linting, and add community standard files such as `CODE_OF_CONDUCT`.

*Peer comparison:* Mature DPGs usually run a more complete CI gate. Pipeline is on the right path but should harden enforcement to avoid regressions.

</details>

<details>
<summary><strong>❌ Criterion 9: Do No Harm</strong></summary>

**Finding:** The repository includes technical safeguards such as export throttling, field sanitization, CSP, and CSRF. However, it also enables user-generated content and contribution flows without clear report/flag/moderation mechanisms or repo-level safety governance.

**Recommendation:** Add report/flag flows, moderation handling, abuse escalation, `CODE_OF_CONDUCT`, and `SECURITY.md`. This is the main gap preventing a stronger DPG readiness claim.

*Peer comparison:* Community-facing DPGs that pass this criterion generally pair policies with enforcement mechanisms. Pipeline currently has the policy surface and technical hygiene, but not enough operational safety tooling.

</details>

---

## DPGs to Leverage

- **Aid Management Platform** (reference): Use its monitoring and accountability patterns as a reference for public-good reporting and governance-oriented data structures.
- **CKAN** (reference): Borrow stronger open-data conventions for metadata, export documentation, and public API discoverability.
- **PotLock** (reference): Use donor transparency and anti-abuse patterns as reference material for contribution and funding-related workflows.

---

## Similar DPGs in Registry

- **Aid Management Platform** - Overlap: development activity tracking and donor-management context. Differentiator: Pipeline is focused on DPG lifecycle management and GitHub-backed compliance evaluation.
- **PotLock** - Overlap: public-goods funding and supporter coordination. Differentiator: Pipeline centers DPG readiness and standards compliance rather than blockchain-native fundraising.
- **CKAN** - Overlap: open data access and export patterns. Differentiator: Pipeline is a project workflow platform, not a general data portal.
- **Mastodon** - Overlap: user-generated content and community interaction patterns. Differentiator: Pipeline is not a social network, but Mastodon is a useful reference for moderation and community safety mechanisms.

---

*Generated by DPG Evaluator v2 - Christex Foundation DPG Accelerator*
