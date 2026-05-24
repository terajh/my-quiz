# Topic Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add quiz topic selection so the app can host multiple quiz sets while keeping the current Kubernetes quiz as the first topic.

**Architecture:** Introduce a `QuizTopic` model and `quizTopics` registry. `QuizPage` derives questions from the selected topic, and storage helpers accept a topic ID so progress remains isolated by topic.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library

---

## File Structure

- Modify: `src/features/quiz/types.ts` - add `QuizTopic`.
- Create: `src/features/quiz/quiz-topics.ts` - export all available topics.
- Modify: `src/features/quiz/questions.ts` - keep Kubernetes questions as the source array for the Kubernetes topic.
- Create: `src/features/quiz/quiz-topics.test.ts` - verify topic registry integrity.
- Modify: `src/features/quiz/storage.ts` - namespace progress by topic ID.
- Create: `src/features/quiz/storage.test.ts` - verify topic-specific storage keys.
- Modify: `src/features/quiz/QuizPage.tsx` - add topic select and derive title/source/questions from selected topic.
- Modify: `src/features/quiz/QuizPage.test.tsx` - verify topic selector and selected topic metadata.
- Modify: `README.md` - document topic-based quiz data structure.

---

### Task 1: Topic Registry

**Files:**
- Modify: `src/features/quiz/types.ts`
- Create: `src/features/quiz/quiz-topics.ts`
- Create: `src/features/quiz/quiz-topics.test.ts`

- [ ] **Step 1: Write failing topic registry test**

Create `quiz-topics.test.ts` that imports `quizTopics` and expects a `kubernetes` topic with title `쿠버네티스 퀴즈`, source label `Notion 개발 > 쿠버네티스`, and at least 24 questions.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/quiz/quiz-topics.test.ts`
Expected: FAIL because `quiz-topics.ts` does not exist.

- [ ] **Step 3: Implement `QuizTopic` and topic registry**

Add `QuizTopic` to `types.ts`. Create `quiz-topics.ts` with a single `kubernetes` topic whose `questions` is the existing `questions` export.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/quiz/quiz-topics.test.ts`
Expected: PASS.

---

### Task 2: Topic-Specific Storage

**Files:**
- Modify: `src/features/quiz/storage.ts`
- Create: `src/features/quiz/storage.test.ts`

- [ ] **Step 1: Write failing storage test**

Create a jsdom test that saves separate answers for `kubernetes` and `future-topic`, then verifies loading each topic returns only that topic's answer.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/quiz/storage.test.ts`
Expected: FAIL because storage helpers do not accept topic IDs yet.

- [ ] **Step 3: Implement topic-specific storage keys**

Change `loadQuizProgress`, `saveQuizProgress`, and `clearQuizProgress` to accept `topicId: string` and use `myquiz-progress:${topicId}`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/quiz/storage.test.ts`
Expected: PASS.

---

### Task 3: Topic Selection UI

**Files:**
- Modify: `src/features/quiz/QuizPage.tsx`
- Modify: `src/features/quiz/QuizPage.test.tsx`

- [ ] **Step 1: Write failing UI test**

Extend the UI test to assert that the `주제` select exists, defaults to `kubernetes`, and the header shows `Notion 개발 > 쿠버네티스` plus `쿠버네티스 퀴즈`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/quiz/QuizPage.test.tsx`
Expected: FAIL because no topic select exists.

- [ ] **Step 3: Implement topic selection**

Use `quizTopics`, `selectedTopicId`, and `selectedTopic.questions` in `QuizPage`. Add the topic select above the section select. Reset filters and load topic-specific answers when selected topic changes.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/quiz/QuizPage.test.tsx`
Expected: PASS.

---

### Task 4: Documentation And Full Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README**

Document that new topics are added in `quiz-topics.ts` and each topic owns its own `questions` array.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0.

- [ ] **Step 3: Commit and push**

Run:

```bash
git add .
git commit -m "퀴즈 주제 선택 기능 추가"
git checkout main
git merge --ff-only codex/topic-selection
git push
```
