# Mobile Quiz UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the quiz solving experience comfortable on mobile without changing the desktop layout.

**Architecture:** Keep the React component structure mostly intact. Add an accessible label to the action row, then use CSS media queries to reorder panels, compress the score strip, enlarge touch targets, and make the action row sticky on mobile.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library

---

## File Structure

- Modify: `src/features/quiz/QuizPage.tsx` - add accessible action row label.
- Modify: `src/features/quiz/QuizPage.test.tsx` - assert the action row exists by role/name.
- Modify: `src/App.css` - implement mobile-first UX refinements inside existing breakpoints.
- Modify: `README.md` - mention mobile support.

---

### Task 1: Accessible Mobile Action Row

**Files:**
- Modify: `src/features/quiz/QuizPage.test.tsx`
- Modify: `src/features/quiz/QuizPage.tsx`

- [ ] **Step 1: Write failing UI test**

Assert that the action row is discoverable with `getByRole('group', { name: '문제 이동과 채점' })`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/quiz/QuizPage.test.tsx`
Expected: FAIL because the action row has no group role and label.

- [ ] **Step 3: Add action row role and label**

Add `role="group"` and `aria-label="문제 이동과 채점"` to the existing `.action-row` container.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/quiz/QuizPage.test.tsx`
Expected: PASS.

---

### Task 2: Mobile CSS

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Update mobile breakpoints**

At `max-width: 1080px`, set `.question-panel`, `.summary-panel`, and `.filter-panel` order values so questions appear first.

- [ ] **Step 2: Add phone-specific refinements**

At `max-width: 640px`, compress `.score-strip`, make `.action-row` sticky at the bottom, set action buttons to equal-width grid columns, increase option touch target height, and add bottom padding to `.quiz-app`.

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: PASS.

---

### Task 3: Documentation And Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README**

Add mobile support to the feature list.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: both commands pass.

- [ ] **Step 3: Commit and push**

Run:

```bash
git add .
git commit -m "모바일 퀴즈 풀이 UX 개선"
git checkout main
git merge --ff-only codex/mobile-quiz-ux
git push
```
