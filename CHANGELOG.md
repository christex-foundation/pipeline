# Changelog

All notable changes to the DPG Pipeline project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project is pre-release and does not yet follow [Semantic Versioning](https://semver.org/).
Version numbers below are retroactively assigned milestones.

---

## [0.9.3] - 2026-04-06 - Server Layer Boundary Enforcement

### Fixed

- Export and profile routes that bypassed the service layer by importing repos directly, now routed through services
- Remaining inline `supabase.from()` calls in route handlers extracted to repo/service layer

### Added

- ESLint configuration (`eslint.config.js`) with architecture boundary rules enforcing routes -> services -> repos layering
- `npm run lint` script for running server boundary checks
- New service functions: `getProfileByUserId`, `getExportProjects`, `getAllProjectUpdates`, `getAllProjectContributions`, `allCategories`
- New repo functions: `getAllUpdates` (projectUpdatesRepo), `getAllContributions` (projectContributionsRepo)
- Server layer boundaries guide (`docs/architecture/server-boundaries.md`)

## [0.9.2] - 2026-04-04 - Criterion 4 Route Cleanup

### Removed

- Dead direct-write `POST` handler from `/api/projects` that bypassed the service/repo pattern
- Incomplete `invitemember` endpoint with no callers and no return value
- Unused global Supabase imports from `user/bookmarks`, `user/projects`, and `user/contributed` routes
- Unused `getUserBookmarkedProjects` import from `user/contributed` route

### Fixed

- `projectUpdates/store` now uses request-scoped `locals.supabase` instead of the global Supabase client
- `imageUploadRepo.js` now throws `Error` on upload failure instead of returning an HTTP `json()` response, restoring the repo layer contract

### Changed

- `projectMembers` route now delegates to `getTeamMembers()` in the service layer instead of performing inline multi-table orchestration with the global client

## [0.9.1] - 2026-04-01 - Provider Abstraction Fixes

### Fixed

- AI service and AI API route now import from the provider registry (`providers/index.js`) instead of directly from `aiProvider.js`, ensuring provider swaps apply consistently
- Storage provider functions (`uploadFile`, `getPublicUrl`, `deleteFiles`) now accept an injected `supabase` client parameter instead of importing a global client, matching the repo layer convention
- Updated `imageUploadRepo`, `imageUploadService`, and all page server callers (`project/create`, `project/edit`, `profile/edit`, `api/file-upload`) to pass `supabase` through the call chain

## [0.9.0] - 2026-03-31 - Platform Independence (DPG Criterion 4)

### Added

- Provider abstraction layer for external services (`src/lib/server/providers/`)
  - AI provider wrapping OpenAI with documented contract for alternative LLMs (Ollama, llama.cpp)
  - Queue provider wrapping BullMQ with automatic in-memory fallback when Redis is unavailable
  - Storage provider wrapping Supabase Storage with contract for alternatives (MinIO, local filesystem)
  - Auth provider wrapping Supabase Auth with contract for alternatives (Keycloak, Ory, SuperTokens)
- Provider registry (`providers/index.js`) with environment-variable-driven provider selection
- In-memory queue fallback enabling deployment without Redis infrastructure
- Provider contract documentation (`src/lib/server/providers/README.md`)
- Repo layer documentation formalizing database abstraction pattern (`src/lib/server/repo/README.md`)

### Changed

- AI service now uses configurable provider instead of direct OpenAI SDK dependency
- Queue operations use provider instead of direct BullMQ instantiation
- Image storage uses provider instead of direct Supabase Storage calls
- Auth operations use provider instead of direct Supabase Auth calls
- Removed `adminAuthClient` export from `supabase.js` (moved to auth provider)

### Documentation

- Rewrote DPG Criterion 4 documentation to disclose all 6 external dependencies (added OpenAI, Redis)
- Added architecture diagram showing provider and repo abstraction layers
- Documented provider contracts with function signatures and open-source alternatives
- Added provider configuration guide for alternative deployments

## [0.8.0] - 2026-03-17 - GDPR & Compliance

### Added

- User account deletion with full data cleanup including storage images ([#437](https://github.com/christex-foundation/pipeline/pull/437))
- Privacy page with personal data export functionality in JSON, CSV, and XML formats ([#438](https://github.com/christex-foundation/pipeline/pull/438))
- DPG compliance tracking dashboard with auto-calculated compliance score ([#440](https://github.com/christex-foundation/pipeline/pull/440))
- Public API export endpoints for projects, categories, contributions, and updates
- XML export format support across all export endpoints
- Legal pages: Terms of Service, Cookie Policy, Data Processing Agreement ([#439](https://github.com/christex-foundation/pipeline/pull/439))
- Legal layout component for consistent legal page styling
- Data extraction exports for users ([#436](https://github.com/christex-foundation/pipeline/pull/436))

### Changed

- Refactored privacy page structure with dedicated layout
- Updated footer links to include legal pages
- Use single contact email across legal pages

### Fixed

- Corrected deletion order and added missing table cleanups on account deletion
- Restored robust export service from feature branch
- Formatting and email consistency across legal pages

### Documentation

- Added export API endpoints to DPG Criterion 6 documentation
- Marked DPG Criterion 7 (Privacy & Legal) as complete

---

## [0.7.0] - 2025-06-26 - UI Overhaul & Performance

### Added

- Major UI overhaul of auth pages, explore page, project detail, project cards, and user profiles ([#349](https://github.com/christex-foundation/pipeline/pull/349))
- Search modal with command palette interface and debounced search
- Service worker with API call handling and cache clearing ([#368](https://github.com/christex-foundation/pipeline/pull/368))
- API route protection with origin validation ([#364](https://github.com/christex-foundation/pipeline/pull/364))
- Pagination support for retrieving projects by categories
- Interactive pipeline page with animations and step details ([#379](https://github.com/christex-foundation/pipeline/pull/379))
- Project social links on the project detail page ([#380](https://github.com/christex-foundation/pipeline/pull/380))
- Partner logos in footer ([#378](https://github.com/christex-foundation/pipeline/pull/378))
- Create project CTA button on explore page
- Mobile and tablet responsive views ([#354](https://github.com/christex-foundation/pipeline/pull/354))
- Server-side tests for project creation
- Function to count project resources
- DPG evaluation process documentation ([#350](https://github.com/christex-foundation/pipeline/pull/350))

### Changed

- Streamlined explore page to single query for loading projects ([#348](https://github.com/christex-foundation/pipeline/pull/348))
- Replaced server load with client load for contribute and edit pages
- Optimized database retrieval by selecting specific fields across all repositories
- Added caching headers to API endpoints
- Reskinned create/edit project forms with reduced fields and reusable components
- Improved search with debouncing and service abstraction ([#358](https://github.com/christex-foundation/pipeline/pull/358))
- Overhauled profile page with layout server consolidation
- Updated core styles and design system
- Standardized input boxes and text areas on project creation
- Removed payment methods from project creation
- Updated HTML structure and improved page metadata
- Updated DPG UI layout and styles ([#375](https://github.com/christex-foundation/pipeline/pull/375))

### Fixed

- Mobile navbar display issues ([#356](https://github.com/christex-foundation/pipeline/pull/356))
- Heading overflow on mobile ([#355](https://github.com/christex-foundation/pipeline/pull/355))
- Sign-in button visibility based on authentication state
- Content Security Policy configuration ([#361](https://github.com/christex-foundation/pipeline/pull/361))
- Contribute button clipping on mobile
- Load more button styling
- Profile validation no longer requires country
- Create project CTA visibility when not logged in ([#363](https://github.com/christex-foundation/pipeline/pull/363))
- Comment out reactive fetchMatchingDPGs ([#347](https://github.com/christex-foundation/pipeline/pull/347))
- Re-added missing database column

### Removed

- Sentry integration temporarily removed ([#365](https://github.com/christex-foundation/pipeline/pull/365))
- Redundant cache headers from multiple endpoints
- Navbar items cleanup
- Redundant console logs

### Documentation

- Added comprehensive DPG compliance documentation ([#381](https://github.com/christex-foundation/pipeline/pull/381))
- Added DPG evaluation process docs
- Added style guide with breadcrumb usage
- Updated README with current project status
- Added GitHub link to footer ([#382](https://github.com/christex-foundation/pipeline/pull/382))

---

## [0.6.0] - 2025-04-04 - Component Library Migration

### Added

- Integrated Shadcn/ui component library for consistent design system ([#337](https://github.com/christex-foundation/pipeline/pull/337))

### Fixed

- Merge-related fixes after Shadcn integration ([#339](https://github.com/christex-foundation/pipeline/pull/339))
- Project creation fixes and project tag editing ([#345](https://github.com/christex-foundation/pipeline/pull/345))

---

## [0.5.0] - 2025-03-21 - GitHub Integration & Evaluation

### Added

- Load and display GitHub contributors for projects ([#285](https://github.com/christex-foundation/pipeline/pull/285), [#319](https://github.com/christex-foundation/pipeline/pull/319))
- Display open GitHub issues with state icons for projects ([#315](https://github.com/christex-foundation/pipeline/pull/315))
- Project evaluation with AI-powered assessment (OpenAI integration)
- Evaluate button on project detail page ([#300](https://github.com/christex-foundation/pipeline/pull/300))
- Sentry error tracking integration ([#326](https://github.com/christex-foundation/pipeline/pull/326))
- DPG status matching from DPG registrar ([#335](https://github.com/christex-foundation/pipeline/pull/335))
- GitHub URL validation on project creation ([#316](https://github.com/christex-foundation/pipeline/pull/316))
- Webhook guide and URL documentation ([#317](https://github.com/christex-foundation/pipeline/pull/317))
- Custom 404 page for project routes ([#324](https://github.com/christex-foundation/pipeline/pull/324))

### Changed

- Renamed "Bookmarks" tab to "Following" ([#305](https://github.com/christex-foundation/pipeline/pull/305))
- Rewrote profile UI with layout grouping and dynamic border on path change ([#323](https://github.com/christex-foundation/pipeline/pull/323))
- Refactored DPG status storage and client-side rendering using badges ([#334](https://github.com/christex-foundation/pipeline/pull/334))
- Refactored static files for better organization ([#322](https://github.com/christex-foundation/pipeline/pull/322))
- Refactored OpenAI response handling
- Load user created projects and contributed projects in profile
- Updated the "Following" tab with improved data loading
- Responsiveness improvements across pages ([#330](https://github.com/christex-foundation/pipeline/pull/330))

### Fixed

- Contributors tab loading and display ([#307](https://github.com/christex-foundation/pipeline/pull/307))
- Contributor count NaN display ([#295](https://github.com/christex-foundation/pipeline/pull/295))
- Contributions project loading ([#293](https://github.com/christex-foundation/pipeline/pull/293))
- Category-based project loading ([#298](https://github.com/christex-foundation/pipeline/pull/298))
- Profile popup not closing on navigation ([#320](https://github.com/christex-foundation/pipeline/pull/320))
- Disabled buttons during CRUD operations to prevent duplicate actions ([#332](https://github.com/christex-foundation/pipeline/pull/332))
- AI response handling issues
- Contribute resource page display ([#303](https://github.com/christex-foundation/pipeline/pull/303))
- Invalid GitHub URL handling on project creation

---

## [0.4.0] - 2025-02-26 - Maintenance & Contributors

### Added

- Contributors page with enhanced display ([#271](https://github.com/christex-foundation/pipeline/pull/271))
- Git update component for project updates ([#275](https://github.com/christex-foundation/pipeline/pull/275))
- Pipeline icon added to browser tab title ([#259](https://github.com/christex-foundation/pipeline/pull/259))
- Pull request information added to project updates

### Changed

- Updated README with links to project resources ([#197](https://github.com/christex-foundation/pipeline/pull/197))
- Updated git update design ([#280](https://github.com/christex-foundation/pipeline/pull/280))
- Handle null user_id and use inline user object for profile attachment in project updates

### Fixed

- Registration issue preventing new user sign-ups ([#273](https://github.com/christex-foundation/pipeline/pull/273))
- Load more projects functionality ([#277](https://github.com/christex-foundation/pipeline/pull/277))
- Z-index on contributors page ([#282](https://github.com/christex-foundation/pipeline/pull/282))
- AI response handling issues

### Removed

- Cleaned up unused dependencies ([#252](https://github.com/christex-foundation/pipeline/pull/252))

### Infrastructure

- Attempted Svelte 5 upgrade, then reverted due to compatibility issues ([#253](https://github.com/christex-foundation/pipeline/pull/253), [#269](https://github.com/christex-foundation/pipeline/pull/269))
- Basic GitHub Actions CI for pull requests ([#256](https://github.com/christex-foundation/pipeline/pull/256))

---

## [0.3.0] - 2024-12-30 - UI Polish & CI Setup

### Added

- Loading states across the application ([#219](https://github.com/christex-foundation/pipeline/pull/219))
- Timestamp display on project updates ([#241](https://github.com/christex-foundation/pipeline/pull/241))
- Date format for comments ([#250](https://github.com/christex-foundation/pipeline/pull/250))
- TailwindCSS Forms library for enhanced form styling ([#251](https://github.com/christex-foundation/pipeline/pull/251))
- SDG icon display in project tags on creation ([#217](https://github.com/christex-foundation/pipeline/pull/217))
- Resource submission with view link ([#226](https://github.com/christex-foundation/pipeline/pull/226))
- Project update component ([#229](https://github.com/christex-foundation/pipeline/pull/229))
- One centralized Supabase instance ([#216](https://github.com/christex-foundation/pipeline/pull/216))
- SVG icon replacements across the application

### Changed

- Redesigned resources component ([#220](https://github.com/christex-foundation/pipeline/pull/220))
- Redesigned profile edit page ([#242](https://github.com/christex-foundation/pipeline/pull/242))
- Redesigned comments UI ([#243](https://github.com/christex-foundation/pipeline/pull/243))
- Migrated to load functions for data fetching on profile and project pages
- Project creation with image upload support
- Delete old images from storage bucket when user changes project image
- Sorted country list alphabetically ([#218](https://github.com/christex-foundation/pipeline/pull/218))
- File upload moved to repository with timestamp appending
- Responsiveness improvements ([#236](https://github.com/christex-foundation/pipeline/pull/236))
- Bumped packages for Svelte 5 compatibility
- Integrated project details into contribute page ([#91](https://github.com/christex-foundation/pipeline/pull/91))

### Fixed

- Navbar issues ([#222](https://github.com/christex-foundation/pipeline/pull/222), [#244](https://github.com/christex-foundation/pipeline/pull/244))
- Project update functionality ([#232](https://github.com/christex-foundation/pipeline/pull/232))
- Date format display ([#230](https://github.com/christex-foundation/pipeline/pull/230))
- Undefined user error ([#199](https://github.com/christex-foundation/pipeline/pull/199))
- Bug on creating project
- Image URL for project cards
- Breaking builds

### Infrastructure

- Added basic GitHub Actions for pull request checks
- Whole project code formatting pass

---

## [0.2.0] - 2024-11-29 - Core Features & Routing

### Added

- Search bar with modal on navigation bar ([#191](https://github.com/christex-foundation/pipeline/pull/191))
- Custom 404 error page with responsive layout ([#187](https://github.com/christex-foundation/pipeline/pull/187))
- DPG status checklist for projects ([#147](https://github.com/christex-foundation/pipeline/pull/147))
- Follow/unfollow system (renamed from bookmarks)
- Sign-in button on navigation ([#63](https://github.com/christex-foundation/pipeline/pull/63))
- Image upload for project banner and profile ([#79](https://github.com/christex-foundation/pipeline/pull/79))
- Comment section on projects
- Load more button for projects ([#174](https://github.com/christex-foundation/pipeline/pull/174))
- DPG flag indicator on projects
- Project team members functionality
- Search modal with refined search functionality ([#193](https://github.com/christex-foundation/pipeline/pull/193))
- Sign-in page link for existing users ([#172](https://github.com/christex-foundation/pipeline/pull/172))
- Seed database with initial data
- Navigation z-index fix to prevent overlap ([#179](https://github.com/christex-foundation/pipeline/pull/179))
- Tab bar title instead of showing localhost ([#148](https://github.com/christex-foundation/pipeline/pull/148))
- Load function redirect for unauthenticated users on contribute and edit screens

### Changed

- Major route refactoring: renamed and reorganized all routes ([#82](https://github.com/christex-foundation/pipeline/pull/82))
  - `signIn` to `sign-in`
  - `createProject` to `project/create`
  - `contribute` moved to `/project/[id]/contribute`
  - Removed home route (use root `/`)
  - Removed confirmation page
  - Colocated resources
  - Refactored API endpoints to RESTful conventions
- Redesigned navigation bar ([#136](https://github.com/christex-foundation/pipeline/pull/136))
- Redesigned footer ([#141](https://github.com/christex-foundation/pipeline/pull/141))
- Redesigned explore page ([#132](https://github.com/christex-foundation/pipeline/pull/132))
- Redesigned profile page with new layout ([#65](https://github.com/christex-foundation/pipeline/pull/65))
- Refactored project creation to use stepper within form ([#125](https://github.com/christex-foundation/pipeline/pull/125))
- Adopted form actions pattern for create project and logout ([#188](https://github.com/christex-foundation/pipeline/pull/188), [#185](https://github.com/christex-foundation/pipeline/pull/185))
- Refactored projects to use repository and service pattern ([#135](https://github.com/christex-foundation/pipeline/pull/135))
- Used progressive enhancement with Zod validation for sign-in and sign-up
- Migrated explore page to use load functions ([#112](https://github.com/christex-foundation/pipeline/pull/112))
- Used reactive statements for dynamic banner and image updates
- Moved DPG status display from left to right side
- SDG icon styling on explore page
- Made sign-in/sign-up buttons rounder ([#155](https://github.com/christex-foundation/pipeline/pull/155))
- Close dropdown menu on navigation ([#137](https://github.com/christex-foundation/pipeline/pull/137))
- Grouped layouts for sign-in pages ([#114](https://github.com/christex-foundation/pipeline/pull/114))
- Changed bookmarks tab to follow

### Fixed

- Profile edit functionality ([#73](https://github.com/christex-foundation/pipeline/pull/73))
- Project edit page ([#140](https://github.com/christex-foundation/pipeline/pull/140))
- Project creation flow ([#116](https://github.com/christex-foundation/pipeline/pull/116))
- Sign-up flow
- Explore page display issues ([#158](https://github.com/christex-foundation/pipeline/pull/158))
- Project card image display ([#159](https://github.com/christex-foundation/pipeline/pull/159))
- Import locals in load functions
- Project image fetching with default fallback ([#134](https://github.com/christex-foundation/pipeline/pull/134))
- Amount format display for projects
- Profile session distortion ([#160](https://github.com/christex-foundation/pipeline/pull/160))
- Load more button on project pages ([#168](https://github.com/christex-foundation/pipeline/pull/168))
- Contribution and crypto flow ([#143](https://github.com/christex-foundation/pipeline/pull/143))
- Removed similar project component ([#68](https://github.com/christex-foundation/pipeline/pull/68))
- Removed notification and team tabs from project detail
- Standardized environment variables ([#49](https://github.com/christex-foundation/pipeline/pull/49))

### Removed

- Unnecessary project files and unused components
- Redundant code across codebase
- Remove button and context menu from project card

### Documentation

- Database setup guide for Supabase ([#181](https://github.com/christex-foundation/pipeline/pull/181))
- Updated CONTRIBUTING.md ([#69](https://github.com/christex-foundation/pipeline/pull/69))
- Added `IF NOT EXISTS` to SQL CREATE TABLE statements

### Infrastructure

- Added Prettier configuration for consistent code formatting ([#56](https://github.com/christex-foundation/pipeline/pull/56))
- Used Supabase admin for auth operations
- Formatted entire codebase with Prettier

---

## [0.1.0] - 2024-10-24 - Foundation

### Added

- Initial project setup with SvelteKit framework
- Supabase authentication integration with sign-in and sign-up flows ([#1](https://github.com/christex-foundation/pipeline/pull/1))
- User profile pages with view and edit functionality
- Profile dropdown navigation component
- Onboarding pages for new users
- Project CRUD operations with stepper interface ([#2](https://github.com/christex-foundation/pipeline/pull/2))
- Project detail pages with funding goals
- Explore page for discovering projects ([#5](https://github.com/christex-foundation/pipeline/pull/5))
- Home page with project showcase ([#3](https://github.com/christex-foundation/pipeline/pull/3))
- Contribution flow with popup interface
- DPG information page
- Profile edit as stepper interface ([#7](https://github.com/christex-foundation/pipeline/pull/7))
- Project categories with filtering
- OpenAI API endpoint for AI features
- GitHub integration API scaffolding

### Changed

- Extracted GitHub-related code into dedicated module
- Refactored API to follow RESTful best practices
- Removed nested folder structure ([#4](https://github.com/christex-foundation/pipeline/pull/4))

### Documentation

- Initial README
- MIT License
- CONTRIBUTING.md v1
- OpenAPI endpoint documentation

---

[0.8.0]: https://github.com/christex-foundation/pipeline/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/christex-foundation/pipeline/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/christex-foundation/pipeline/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/christex-foundation/pipeline/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/christex-foundation/pipeline/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/christex-foundation/pipeline/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/christex-foundation/pipeline/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/christex-foundation/pipeline/releases/tag/v0.1.0
