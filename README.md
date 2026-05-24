# myquiz

Notion `개발 > 쿠버네티스` 문서 내용을 바탕으로 만든 정적 퀴즈 웹사이트입니다. 객관식, O/X, 빈칸, 주관식, 순서 맞추기, 매칭형 문제를 한 화면에서 풀고 즉시 채점할 수 있습니다.

배포 URL: https://terajh.github.io/my-quiz/

## 주요 기능

- 쿠버네티스 기본 구조, Deployment, Service, Ingress, 헬스체크, 배포 전략, `kubectl` 명령어 기반 문제 제공
- 객관식, O/X, 빈칸, 주관식, 순서 맞추기, 매칭형 문제 지원
- 섹션별, 문제 유형별 필터
- 오답만 다시 풀기
- 즉시 채점과 해설 표시
- 진행률, 정답 수, 오답 수, 정답률 표시
- 모바일 화면에서 문제 우선 배치와 하단 고정 액션 바 지원
- 브라우저 `localStorage` 기반 풀이 기록 저장

## 기술 스택

- React
- TypeScript
- Vite
- Vitest
- Testing Library
- GitHub Actions
- GitHub Pages

## 시작하기

```bash
npm install
npm run dev
```

로컬 개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 스크립트

```bash
npm run dev
```

Vite 개발 서버를 실행합니다.

```bash
npm test
```

문제 데이터, 채점 로직, 상태 계산, UI 흐름 테스트를 실행합니다.

```bash
npm run build
```

TypeScript 컴파일과 정적 사이트 빌드를 실행합니다.

```bash
npm run preview
```

빌드 결과물을 로컬에서 미리 확인합니다.

## 프로젝트 구조

```text
src/
  App.tsx
  App.css
  features/
    quiz/
      QuizPage.tsx
      quiz-topics.ts
      questions.ts
      grading.ts
      quiz-state.ts
      storage.ts
      types.ts
```

- `quiz-topics.ts`: 사용자가 선택할 수 있는 퀴즈 주제 목록
- `questions.ts`: 쿠버네티스 퀴즈 문제 데이터
- `grading.ts`: 문제 유형별 채점 로직
- `quiz-state.ts`: 진행률, 점수, 필터링, 오답 모드 계산
- `storage.ts`: 주제별 브라우저 저장소 연동
- `QuizPage.tsx`: 퀴즈 풀이 화면

## 주제와 문제 추가 또는 수정

퀴즈는 `QuizTopic` 단위로 관리합니다. 현재는 `kubernetes` 주제가 등록되어 있고, 이후 새 문서 기반 퀴즈를 추가할 때는 새 문제 배열을 만든 뒤 `src/features/quiz/quiz-topics.ts`에 주제를 추가하면 됩니다.

각 주제는 다음 값을 가집니다.

- `id`: 저장소 키와 select 값에 사용하는 고유 ID
- `title`: 화면 상단과 주제 select에 표시되는 이름
- `description`: 주제 설명
- `sourceLabel`: 출처 또는 문서 경로
- `questions`: 해당 주제의 문제 배열

풀이 기록은 `myquiz-progress:<topicId>` 형식으로 주제별 분리 저장됩니다.

문제 데이터는 `QuizQuestion` 타입을 따릅니다. 지원하는 문제 유형은 다음과 같습니다.

- `multiple-choice`
- `true-false`
- `fill-blank`
- `short-answer`
- `ordering`
- `matching`

문제를 수정한 뒤에는 아래 명령으로 데이터 무결성과 빌드를 확인하세요.

```bash
npm test
npm run build
```

## 배포

`main` 브랜치에 푸시하면 `.github/workflows/pages.yml` 워크플로가 실행됩니다.

배포 흐름은 다음과 같습니다.

1. 의존성 설치
2. 테스트 실행
3. Vite 정적 빌드
4. GitHub Pages artifact 업로드
5. GitHub Pages 배포

Vite는 GitHub Pages 하위 경로에 맞춰 `base: '/my-quiz/'`로 설정되어 있습니다.

## 현재 한계

- AI API를 사용한 자동 문제 생성은 아직 포함하지 않았습니다.
- 현재 문제는 TypeScript 파일에 직접 작성된 정적 데이터입니다.
- 다른 문서 기반 퀴즈가 필요하면 문제 데이터를 수동으로 추가해야 합니다.
