# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests. | tdd | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/tdd/SKILL.md |
| Design the overall codebase structure, architecture, or module boundaries. Use when creating new codebases, adding modules, planning large refactors, or deciding between approaches. | codebase-design | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/codebase-design/SKILL.md |
| Review code changes. Use when the user wants a thorough code review after writing or modifying code. | code-review | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/code-review/SKILL.md |
| Design frontend user interfaces and components. Use when creating or refactoring UI components, designing layouts, or planning frontend architecture. | frontend-design | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/frontend-design/SKILL.md |
| Vercel React best practices. Use when building React apps with Next.js, TypeScript, or on Vercel. | vercel-react-best-practices | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/vercel-react-best-practices/SKILL.md |
| Supabase Postgres best practices. Use when working with Supabase, PostgreSQL, or database migrations. | supabase-postgres-best-practices | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/supabase-postgres-best-practices/SKILL.md |
| Prisma with Postgres. Use when using Prisma ORM with PostgreSQL databases. | prisma-postgres | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/prisma-postgres/SKILL.md |
| Set up pre-commit hooks. Use when configuring git hooks, linting, formatting, or code quality checks. | setup-pre-commit | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/setup-pre-commit/SKILL.md |
| Web application testing. Use when writing end-to-end, integration, or UI tests for web apps. | webapp-testing | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/webapp-testing/SKILL.md |
| Security and hardening. Use when addressing security concerns, auth, or vulnerability fixes. | security-and-hardening | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/security-and-hardening/SKILL.md |
| Documentation and ADRs. Use when writing docs, README files, architecture decision records, or API docs. | documentation-and-adrs | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/documentation-and-adrs/SKILL.md |
| API and interface design. Use when designing REST/GraphQL APIs, types, or interfaces. | api-and-interface-design | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/api-and-interface-design/SKILL.md |
| Node.js backend patterns. Use when building Node.js backend services, APIs, or middleware. | nodejs-backend-patterns | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/nodejs-backend-patterns/SKILL.md |
| NestJS best practices. Use when working with NestJS framework for building scalable Node.js apps. | nestjs-best-practices | C:/Users/tiago/OneDrive/Desktop/utn/3_semestre/metodologiaSistemas1/desarrollo active stack/turnos-odontologia/agent/skills/nestjs-best-practices/SKILL.md |

## Compact Rules

### tdd
- Test behavior through public interfaces, not implementation details — code can change, tests shouldn't.
- Only test at pre-agreed seams — confirm seams with the user before writing any test.
- Avoid implementation-coupled tests: no mocking internals, no testing private methods, no side channels.
- Avoid tautological tests: expected values must come from an independent source of truth (spec, worked example, known literal).
- Avoid horizontal slicing: work in vertical slices (one test → one implementation → repeat), not "all tests first".
- Red before green: write failing test first, then only enough code to pass it.
- One slice at a time: one seam, one test, one minimal implementation per cycle.
- Refactoring belongs to code review, not the red→green loop.

### codebase-design
- Design module boundaries by domain, not by technical layers — prefer cohesive modules with clear public APIs.
- Define explicit seams (interfaces/adapters) between modules; test through those seams.
- Keep dependencies pointing inward (dependency inversion) — high-level doesn't depend on low-level details.
- Favor composition over inheritance; keep abstractions minimal and justified.
- Locality first: colocate code that changes together; avoid premature generalization.
- Document tradeoffs in ADRs when making non-obvious architectural decisions.
- Be explicit about data contracts, invariants, and error handling at module boundaries.
- Avoid over-engineering: solve the current problem with room to evolve, not "future-proof" abstractions.

### code-review
- Review for correctness, security, maintainability, and adherence to project conventions.
- Check tests cover behavior at appropriate seams; reject implementation-coupled or tautological tests.
- Verify naming, types, error handling, and edge cases are handled appropriately.
- Flag potential performance issues, N+1 queries, or resource leaks.
- Ensure no secrets, credentials, or sensitive data are exposed.
- Check for proper input validation, authorization, and authentication.
- Look for code duplication and suggest reasonable refactoring opportunities.
- Be constructive and specific; explain the "why" behind each suggestion.
- Verify the change aligns with the stated goal and doesn't introduce scope creep.

### frontend-design
- Component design: small, focused, reusable components with clear props interfaces.
- Prefer composition over inheritance; keep component trees shallow when possible.
- Separate presentational and container logic; extract custom hooks for reusable stateful logic.
- Accessibility first: use semantic HTML, ARIA attributes where needed, ensure keyboard navigation.
- Responsive design: mobile-first approach; test key breakpoints.
- State management: use local state for component-specific; lift state only when truly shared.
- Performance: lazy load heavy components, optimize images, minimize re-renders.
- Consistent styling: follow project styling conventions, use design tokens/variables.
- TypeScript: strict typing for props, events, and component APIs.

### vercel-react-best-practices
- Use Server Components by default; only add 'use client' when interactivity/hooks needed.
- Leverage React 19 features: use() hook for promises/context, Actions with useActionState, useOptimistic.
- No unnecessary memoization (useMemo/useCallback) — React Compiler handles when enabled.
- Prefer built-in Next.js patterns (App Router) over custom workarounds.
- Type-safe APIs: use TypeScript end-to-end; validate with Zod/valibot at boundaries.
- Optimize for Core Web Vitals: proper loading states, suspense boundaries where appropriate.
- Follow file-based routing conventions and colocate route handlers properly.
- Keep client bundles small: avoid importing heavy libs on client; use dynamic imports.

### supabase-postgres-best-practices
- Design schemas with proper normalization; use foreign keys and CHECK constraints.
- Leverage RLS (Row Level Security) for multi-tenant/data isolation — enforce at DB level.
- Use transactions for multi-step operations; handle race conditions with proper constraints (UNIQUE, EXCLUDE).
- Index wisely: index columns used in WHERE, JOIN, ORDER BY; avoid over-indexing.
- Use UUIDs for primary keys where appropriate; consider performance tradeoffs.
- Migrations: version-controlled, idempotent, and reversible where possible.
- Secure by default: never store secrets in DB; use Supabase Vault/RLS appropriately.
- Follow least privilege: grant minimal DB permissions to roles/services.

### prisma-postgres
- Define clear Prisma schemas with proper relations, constraints, and indexes.
- Use migrations (prisma migrate) over manual schema changes; commit migration files.
- Keep Prisma client type-safe: use generated types throughout the app.
- Handle transactions with prisma.$transaction for atomic operations.
- Use select/include intentionally to avoid over-fetching data.
- Validate inputs before DB operations; don't trust client data.
- Handle soft deletes explicitly if needed (deletedAt timestamp pattern).
- Optimize queries: avoid N+1 by using proper includes or batching.

### setup-pre-commit
- Configure hooks for linting, formatting, type-checking, and security scanning.
- Keep hooks fast: run only what's necessary for changed files when possible.
- Fail fast on issues; provide clear error messages.
- Commit hook configs (.pre-commit-config.yaml, husky, etc.) to version control.
- Use pinned versions of hook dependencies for reproducibility.
- Include tests/build checks only if they run quickly; otherwise run in CI.
- Document hook setup in README for new contributors.
- Avoid hooks that modify files silently without user awareness.

### webapp-testing
- Test user-visible behavior, not implementation details.
- Write deterministic tests: avoid time-dependent, random, or external API dependencies.
- Use Page Object Model or similar for E2E to reduce maintenance.
- Isolate tests: each test should be independent and clean up after itself.
- Focus on critical user flows (happy path + key error cases).
- Use data-testid/selectors that are stable, not CSS classes that may change.
- Mock external services (3rd party APIs) in E2E tests to avoid flakiness/cost.
- Keep tests fast and reliable; parallelize where appropriate.

### security-and-hardening
- Never commit secrets, keys, or credentials — use .env files, secret managers.
- Validate and sanitize all user inputs (server-side validation is mandatory).
- Use parameterized queries/prepared statements to prevent SQL injection.
- Implement proper authentication/authorization (RBAC/ABAC as needed).
- Hash passwords with strong algorithms (bcrypt/argon2); never store plaintext.
- Secure cookies: HttpOnly, Secure, SameSite flags; use CSRF protection.
- Encrypt sensitive data at rest and in transit (TLS everywhere).
- Validate webhook signatures from external services (MercadoPago, WhatsApp).
- Follow OWASP Top 10; log security events without logging sensitive data.

### documentation-and-adrs
- Write docs for humans: clear, concise, scannable with proper headings.
- Document architectural decisions in ADRs (Context, Decision, Consequences).
- Keep README up to date: setup, run, test, deploy instructions.
- Document public APIs with examples (request/response schemas).
- Use diagrams sparingly but meaningfully (mermaid, etc.) when they clarify.
- Record breaking changes and migration notes.
- Link related docs; avoid duplication, DRY principle for docs.
- Write in the project's language/style; include version info when relevant.

### api-and-interface-design
- Design RESTful APIs with clear resource naming (nouns, not verbs); use proper HTTP methods/status codes.
- Version APIs from the start (e.g., /api/v1/) or have a clear versioning strategy.
- Validate all inputs at API boundaries with explicit schemas.
- Return consistent error responses with machine-readable error codes/messages.
- Use pagination, filtering, sorting for list endpoints.
- Keep contracts stable; document breaking changes.
- Prefer explicit DTOs/types over loose typing at boundaries.
- Consider idempotency for mutating operations (especially payments/webhooks).
- Secure endpoints: require auth where needed, rate-limit sensitive operations.

### nodejs-backend-patterns
- Structure by feature/domain modules, not by file type (controllers/services/repos).
- Use dependency injection/container pattern to improve testability.
- Handle async errors properly: use try/catch, centralized error handling middleware.
- Validate env vars on startup with schema validation (zod/env-safe).
- Use structured logging (JSON) with correlation IDs for traceability.
- Manage DB connections efficiently; use connection pooling.
- Handle graceful shutdowns for long-running processes.
- Keep business logic in service/domain layer, not in controllers/routes.
- Use transactions for data consistency when touching multiple entities.

### nestjs-best-practices
- Follow NestJS modular architecture: modules per feature/domain.
- Use decorators, guards, pipes, interceptors as intended.
- Validate DTOs with class-validator/class-transformer.
- Implement proper exception filters for consistent error responses.
- Use ConfigModule for env management; validate config on load.
- Leverage dependency injection; avoid circular dependencies.
- Keep controllers thin; put logic in services/providers.
- Use TypeORM/Prisma integrations properly with proper scoping.
- Write unit tests for services, e2e for critical flows.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | AGENTS.md | Not found - no project conventions yet |
