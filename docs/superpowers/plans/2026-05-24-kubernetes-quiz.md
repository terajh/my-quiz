# Kubernetes Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Notion `개발 > 쿠버네티스` 문서 기반 문제를 여러 유형으로 풀 수 있는 로컬 웹사이트를 만든다.

**Architecture:** React/Vite 앱 안에 문제 데이터, 채점 로직, 상태 전이 로직을 분리한다. UI는 단일 학습 화면 중심으로 구성하고, 풀이 결과는 `localStorage`에 저장한다.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS

---

## File Structure

- Create: `package.json` - Vite, test, build 스크립트와 의존성
- Create: `index.html` - 앱 진입 HTML
- Create: `src/main.tsx` - React 렌더링 진입점
- Create: `src/App.tsx` - 앱 루트
- Create: `src/features/quiz/types.ts` - 문제와 답안 타입
- Create: `src/features/quiz/questions.ts` - Notion 문서 기반 문제 데이터
- Create: `src/features/quiz/grading.ts` - 문제 유형별 채점 순수 함수
- Create: `src/features/quiz/quiz-state.ts` - 진행률, 점수, 오답 다시 풀기 상태 계산
- Create: `src/features/quiz/storage.ts` - `localStorage` 저장/복원 함수
- Create: `src/features/quiz/QuizPage.tsx` - 문제 풀이 화면
- Create: `src/features/quiz/*.test.ts` - 데이터, 채점, 상태 테스트
- Create: `src/App.css` - 화면 스타일

---

### Task 1: Scaffold Project

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.css`
- Create: `src/vite-env.d.ts`
- Create: `tsconfig.json`
- Create: `vite.config.ts`

- [ ] **Step 1: Create Vite React TypeScript scaffold**

Run:

```bash
npm create vite@latest . -- --template react-ts
```

Expected: Vite creates React TypeScript project files in the repository root.

- [ ] **Step 2: Install test dependencies**

Run:

```bash
npm install
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: `node_modules` and `package-lock.json` are created.

- [ ] **Step 3: Configure test scripts**

Modify `package.json` scripts to include:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Commit scaffold**

Run:

```bash
git add package.json package-lock.json index.html src tsconfig.json vite.config.ts
git commit -m "웹사이트 프로젝트 초기 구성"
```

---

### Task 2: Question Data And Grading

**Files:**
- Create: `src/features/quiz/types.ts`
- Create: `src/features/quiz/questions.ts`
- Create: `src/features/quiz/grading.ts`
- Create: `src/features/quiz/grading.test.ts`
- Create: `src/features/quiz/questions.test.ts`

- [ ] **Step 1: Write failing data integrity test**

Create `src/features/quiz/questions.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { questions } from './questions';

describe('questions', () => {
  it('has unique IDs and complete explanations', () => {
    const ids = new Set(questions.map((question) => question.id));

    expect(ids.size).toBe(questions.length);
    expect(questions.length).toBeGreaterThanOrEqual(24);
    expect(questions.every((question) => question.section.length > 0)).toBe(true);
    expect(questions.every((question) => question.explanation.length > 0)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/features/quiz/questions.test.ts
```

Expected: FAIL because `questions` does not exist.

- [ ] **Step 3: Write failing grading tests**

Create `src/features/quiz/grading.test.ts` with tests for multiple choice, true/false, text, ordering, and matching answers.

- [ ] **Step 4: Run grading tests to verify they fail**

Run:

```bash
npm test -- src/features/quiz/grading.test.ts
```

Expected: FAIL because `gradeAnswer` does not exist.

- [ ] **Step 5: Implement types, question data, and grading**

Implement `types.ts`, at least 24 questions in `questions.ts`, and `gradeAnswer(question, answer)` in `grading.ts`.

- [ ] **Step 6: Run tests to verify they pass**

Run:

```bash
npm test -- src/features/quiz/questions.test.ts src/features/quiz/grading.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```bash
git add src/features/quiz
git commit -m "쿠버네티스 문제 데이터와 채점 로직 추가"
```

---

### Task 3: Quiz State

**Files:**
- Create: `src/features/quiz/quiz-state.ts`
- Create: `src/features/quiz/quiz-state.test.ts`
- Create: `src/features/quiz/storage.ts`

- [ ] **Step 1: Write failing state tests**

Create tests for score calculation, progress calculation, filtered questions, and incorrect-only mode.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/features/quiz/quiz-state.test.ts
```

Expected: FAIL because state helpers do not exist.

- [ ] **Step 3: Implement state and storage helpers**

Implement pure functions for summary and filtering. Implement `loadQuizProgress` and `saveQuizProgress` with guarded JSON parsing.

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
npm test -- src/features/quiz/quiz-state.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/quiz/quiz-state.ts src/features/quiz/quiz-state.test.ts src/features/quiz/storage.ts
git commit -m "문제 풀이 상태 계산 로직 추가"
```

---

### Task 4: Quiz UI

**Files:**
- Create: `src/features/quiz/QuizPage.tsx`
- Create: `src/features/quiz/QuizPage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write failing UI test**

Create a test that renders the app, selects an answer, submits it, and sees the explanation.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- src/features/quiz/QuizPage.test.tsx
```

Expected: FAIL because `QuizPage` does not exist.

- [ ] **Step 3: Implement QuizPage**

Implement filters, current question rendering, answer controls for every question type, submit, explanation, next, reset, and incorrect-only mode.

- [ ] **Step 4: Implement responsive CSS**

Style a three-column desktop layout and a single-column mobile layout. Use a restrained operational-tool visual style with high-contrast focus states.

- [ ] **Step 5: Run UI test**

Run:

```bash
npm test -- src/features/quiz/QuizPage.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/App.tsx src/App.css src/features/quiz/QuizPage.tsx src/features/quiz/QuizPage.test.tsx
git commit -m "쿠버네티스 문제 풀이 화면 구현"
```

---

### Task 5: Full Verification

**Files:**
- Modify only if verification exposes defects.

- [ ] **Step 1: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: build exits with code 0 and creates `dist`.

- [ ] **Step 3: Run local server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite serves the app on a local URL.

- [ ] **Step 4: Verify in Chrome**

Open the local URL in Chrome. Verify initial render, answer submission, explanation display, filters, reset, and incorrect-only mode.

- [ ] **Step 5: Commit final verification fixes**

Run this only if verification required code changes:

```bash
git add .
git commit -m "문제 풀이 웹사이트 검증 보완"
```
