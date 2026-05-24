# 쿠버네티스 문제 풀이 웹사이트 설계

## 목표

Notion `개발 > 쿠버네티스` 문서 내용을 바탕으로 여러 유형의 문제를 풀 수 있는 로컬 웹사이트를 만든다. 사용자는 문서를 다시 읽지 않고도 클러스터 구조, 배포 흐름, Service, Ingress, 헬스체크, 운영 명령어를 반복 학습할 수 있어야 한다.

## 대상 문서 범위

- 쿠버네티스 기본 구조: 클러스터, 노드, Control Plane, Worker Node, Pod
- 핵심 리소스: Deployment, ReplicaSet, Service, Ingress
- 배포 흐름: Dockerfile, 이미지 빌드, Registry, Deployment 적용, Service 연결, Ingress 외부 노출
- kubectl 명령어: `get pods`, `get svc`, `describe`, `logs`, `rollout status`, `scale`, `rollout undo`, `drain`, `apply -k`
- Service: ClusterIP, NodePort, LoadBalancer, selector, endpoint, CoreDNS, port-forward
- Ingress: Ingress Controller, DNS, GSLB, 로그 수집 파이프라인, Kustomize, Gateway API/Kingress 전환 주의점
- 헬스체크와 운영: Liveness Probe, Readiness Probe, Request/Limit, Rolling Update, Blue/Green, Canary, 네트워크 보안

## 문제 유형

- 객관식: 하나의 정답을 고르는 문제
- O/X: 문장의 참거짓을 빠르게 확인하는 문제
- 빈칸: 핵심 용어를 입력하는 문제
- 주관식: 짧은 문장으로 개념을 설명하는 문제
- 순서 맞추기: 배포나 트래픽 흐름을 올바른 순서로 배열하는 문제
- 매칭형: 개념과 설명 또는 명령어와 용도를 연결하는 문제

## 사용자 경험

- 첫 화면은 바로 문제 풀이 화면으로 시작한다.
- 상단에는 전체 점수, 진행률, 현재 필터가 보인다.
- 왼쪽 영역에는 섹션과 문제 유형 필터가 있다.
- 중앙 영역에는 한 문제씩 표시하고 답안 입력, 채점, 해설 확인, 다음 문제 이동을 제공한다.
- 오른쪽 영역에는 학습 요약, 오답 수, 남은 문제 수를 보여준다.
- 오답 다시 풀기 모드는 틀린 문제만 다시 순회한다.
- 풀이 상태는 브라우저 `localStorage`에 저장되어 새로고침 후에도 유지된다.

## 기술 설계

- `React + TypeScript + Vite`로 정적 웹 앱을 구성한다.
- 문제 데이터는 `src/features/quiz/questions.ts`에 정적 데이터로 보관한다.
- 채점 로직은 `src/features/quiz/grading.ts`에 분리한다.
- 상태 전이는 `src/features/quiz/quiz-state.ts`에 순수 함수로 분리해 테스트한다.
- UI는 `App.tsx`와 `src/features/quiz/QuizPage.tsx` 중심으로 구성한다.
- 테스트는 `vitest`와 `@testing-library/react`를 사용한다.

## 검증 기준

- 문제 데이터는 ID 중복이 없고 모든 문제에 해설과 섹션이 있다.
- 각 문제 유형의 채점 로직이 통과한다.
- 오답 다시 풀기와 진행률 계산이 테스트된다.
- `npm test`와 `npm run build`가 성공한다.
- Chrome에서 로컬 웹사이트를 열어 문제 풀이, 채점, 해설, 필터, 오답 다시 풀기 동작을 확인한다.
