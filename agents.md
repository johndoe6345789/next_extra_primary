<![CDATA[# AI Agent Configurations

This file defines specialized AI agent roles for automated tasks in the
Nextra project. Each agent has a specific responsibility and set of
instructions.

---

## Code Reviewer Agent

**Trigger**: Runs on every pull request.

**Responsibilities**:
- Review code style compliance (80-char lines, naming conventions).
- Verify TypeScript strict mode compliance (no `any`, no implicit returns).
- Check C++ adherence to `.clang-format` and `.clang-tidy` rules.
- Verify all interactive components have `data-testid` and `aria-label`.
- Confirm no file exceeds 100 lines of code.
- Check that constants are in JSON files, not hardcoded.
- Verify new API endpoints are documented in `docs/api.md`.
- Flag any Python or shell script files.

**Review Checklist**:
1. Are all TypeScript types explicit (no `any`)?
2. Do all components follow atomic design (atoms/molecules/organisms)?
3. Are all user-facing strings in translation files?
4. Is business logic in hooks (frontend) or services (backend)?
5. Are there JSDoc/Doxygen comments on all public exports?
6. Do accessibility attributes exist on all interactive elements?
7. Are imports using the `@/` alias (no relative `../../`)?
8. Is the file under 100 lines?

**Output format**: Inline comments on the PR with severity labels
(`error`, `warning`, `suggestion`).

---

## Test Writer Agent

**Trigger**: On request, when new components or services are added.

**Responsibilities**:
- Generate unit tests for React components using React Testing Library.
- Generate unit tests for custom hooks.
- Generate GTest tests for C++ services and utilities.
- Follow existing test patterns in the codebase.

**Frontend test conventions**:
- File name: `<Component>.test.tsx` or `<hook>.test.ts`.
- Use `render`, `screen`, `userEvent` from Testing Library.
- Test user-visible behavior, not implementation details.
- Test accessibility: verify ARIA attributes, keyboard navigation.
- Mock API calls using MSW or RTK Query test utilities.
- Minimum cases: render, interaction, error state, loading state.

**Backend test conventions**:
- File name: `test_<module>.cpp`.
- Use GTest `TEST_F` with fixtures for setup/teardown.
- Mock database calls where appropriate.
- Test both success and error paths.
- Verify JSON response structure.

**Example frontend test structure**:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@/components/atoms/ComponentName';

describe('ComponentName', () => {
  it('renders with default props', () => { ... });
  it('handles user interaction', async () => { ... });
  it('displays error state', () => { ... });
  it('is accessible via keyboard', async () => { ... });
});
```

---

## Translation Agent

**Trigger**: When new user-facing strings are added to the codebase.

**Responsibilities**:
- Detect new translation keys added to `frontend/src/messages/en.json`.
- Generate translations for all other locale files (`es.json`, etc.).
- Maintain consistent key structure across all locale files.
- Preserve existing translations (never overwrite).
- Use natural, idiomatic phrasing (not literal translation).

**Key conventions**:
- Keys use dot notation grouped by feature: `"auth.login.title"`.
- Namespace groups: `common`, `auth`, `dashboard`, `gamification`,
  `notifications`, `chat`, `errors`, `validation`.
- Pluralization follows ICU MessageFormat syntax.
- Variables use curly braces: `"Welcome, {name}"`.

**Workflow**:
1. Read the diff to find new keys in `en.json`.
2. For each new key, generate the translation in every locale file.
3. Open a PR with the translation additions.

---

## Accessibility Auditor Agent

**Trigger**: On pull requests that modify component files.

**Responsibilities**:
- Verify all interactive elements have appropriate ARIA attributes.
- Check keyboard navigation flow (Tab, Shift+Tab, Enter, Escape).
- Verify screen reader compatibility (labels, live regions, roles).
- Check color contrast meets WCAG 2.1 AA standards.
- Verify focus management on route changes and modal open/close.
- Check that images have meaningful `alt` text.
- Verify form fields have associated `<label>` elements.

**Audit checklist**:
1. **ARIA attributes**: Every button, link, and input has `aria-label`
   or visible associated label.
2. **Keyboard navigation**: All interactive elements are reachable via
   Tab. Custom widgets support arrow keys where appropriate.
3. **Focus management**: Focus moves to new content on navigation.
   Focus is trapped in modals. Focus returns to trigger on close.
4. **Live regions**: Dynamic content updates use `aria-live` (e.g.,
   notification counts, chat messages, toast messages).
5. **Semantic HTML**: Headings are hierarchical. Lists use `<ul>`/`<ol>`.
   Navigation uses `<nav>`. Main content uses `<main>`.
6. **Color contrast**: Text meets 4.5:1 ratio (normal) or 3:1 (large).
   Interactive elements meet 3:1 against background.
7. **Motion**: Animations respect `prefers-reduced-motion`.
8. **Forms**: Error messages are linked via `aria-describedby`.
   Required fields use `aria-required`. Invalid fields use
   `aria-invalid`.

**Output format**: Markdown report listing issues grouped by severity
(Critical, Major, Minor) with file locations and remediation steps.
]]>