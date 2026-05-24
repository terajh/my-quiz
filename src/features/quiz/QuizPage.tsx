import { useEffect, useState } from 'react';
import { gradeAnswer } from './grading';
import { quizTopics } from './quiz-topics';
import {
  buildQuizSummary,
  getAvailableSections,
  getAvailableTypes,
  getVisibleQuestions,
  type AnswerRecord,
} from './quiz-state';
import { clearQuizProgress, loadQuizProgress, saveQuizProgress } from './storage';
import type { MatchingQuestion, OrderingQuestion, QuestionType, QuizAnswer, QuizQuestion } from './types';

const typeLabels: Record<QuestionType, string> = {
  'multiple-choice': '객관식',
  'true-false': 'O/X',
  'fill-blank': '빈칸',
  'short-answer': '주관식',
  ordering: '순서',
  matching: '매칭',
};

export function QuizPage() {
  const [selectedTopicId, setSelectedTopicId] = useState(quizTopics[0].id);
  const selectedTopic = quizTopics.find((topic) => topic.id === selectedTopicId) ?? quizTopics[0];
  const questions = selectedTopic.questions;
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>(() => loadQuizProgress(selectedTopicId));
  const [sectionFilter, setSectionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all');
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState<QuizAnswer>('');

  const sections = getAvailableSections(questions);
  const types = getAvailableTypes(questions);
  const visibleQuestions = getVisibleQuestions(questions, {
    section: sectionFilter,
    type: typeFilter,
    incorrectOnly,
    answers,
  });
  const safeIndex = Math.min(currentIndex, Math.max(visibleQuestions.length - 1, 0));
  const currentQuestion = visibleQuestions[safeIndex];
  const answerRecord = currentQuestion ? answers[currentQuestion.id] : undefined;
  const summary = buildQuizSummary(questions, answers);

  useEffect(() => {
    setAnswers(loadQuizProgress(selectedTopicId));
    setSectionFilter('all');
    setTypeFilter('all');
    setIncorrectOnly(false);
    setCurrentIndex(0);
    setDraftAnswer('');
  }, [selectedTopicId]);

  useEffect(() => {
    saveQuizProgress(selectedTopicId, answers);
  }, [answers]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [sectionFilter, typeFilter, incorrectOnly]);

  useEffect(() => {
    if (!currentQuestion) {
      setDraftAnswer('');
      return;
    }

    setDraftAnswer(answerRecord?.answer ?? getEmptyAnswer(currentQuestion));
  }, [currentQuestion?.id, answerRecord?.answer]);

  function submitAnswer() {
    if (!currentQuestion) {
      return;
    }

    const result = gradeAnswer(currentQuestion, draftAnswer);
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer: result.normalizedAnswer,
        correct: result.correct,
      },
    }));
  }

  function resetProgress() {
    clearQuizProgress(selectedTopicId);
    setAnswers({});
    setCurrentIndex(0);
  }

  return (
    <main className="quiz-app">
      <header className="topbar">
        <div>
          <p className="eyebrow">{selectedTopic.sourceLabel}</p>
          <h1>{selectedTopic.title}</h1>
        </div>
        <div className="score-strip" aria-label="학습 현황">
          <Metric label="진행" value={`${summary.progressPercentage}%`} />
          <Metric label="정답" value={`${summary.correct}/${summary.answered}`} />
          <Metric label="남은 문제" value={`${summary.remaining}`} />
        </div>
      </header>

      <section className="workspace" aria-label="문제 풀이 작업 영역">
        <aside className="filter-panel" aria-label="필터">
          <label>
            주제
            <select value={selectedTopicId} onChange={(event) => setSelectedTopicId(event.target.value)}>
              {quizTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            섹션
            <select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section === 'all' ? '전체 섹션' : section}
                </option>
              ))}
            </select>
          </label>

          <label>
            유형
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as QuestionType | 'all')}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? '전체 유형' : typeLabels[type]}
                </option>
              ))}
            </select>
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={incorrectOnly}
              onChange={(event) => setIncorrectOnly(event.target.checked)}
            />
            오답만 보기
          </label>

          <button className="secondary-button" type="button" onClick={resetProgress}>
            기록 초기화
          </button>
        </aside>

        <section className="question-panel" aria-live="polite">
          {currentQuestion ? (
            <>
              <div className="question-meta">
                <span>{currentQuestion.section}</span>
                <span>{typeLabels[currentQuestion.type]}</span>
                <span>
                  {safeIndex + 1} / {visibleQuestions.length}
                </span>
              </div>

              <h2>{currentQuestion.prompt}</h2>

              <div className="answer-area">
                <AnswerControl question={currentQuestion} value={draftAnswer} onChange={setDraftAnswer} />
              </div>

              <div className="action-row">
                <button className="primary-button" type="button" onClick={submitAnswer}>
                  채점하기
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                  disabled={safeIndex === 0}
                >
                  이전
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setCurrentIndex((index) => Math.min(index + 1, visibleQuestions.length - 1))}
                  disabled={safeIndex >= visibleQuestions.length - 1}
                >
                  다음
                </button>
              </div>

              {answerRecord ? (
                <section className={answerRecord.correct ? 'result correct' : 'result incorrect'} aria-label="채점 결과">
                  <strong>{answerRecord.correct ? '정답입니다' : '오답입니다'}</strong>
                  <p>{currentQuestion.explanation}</p>
                </section>
              ) : null}
            </>
          ) : (
            <div className="empty-state">
              <h2>표시할 문제가 없습니다</h2>
              <p>필터를 바꾸거나 기록 초기화를 실행하세요.</p>
            </div>
          )}
        </section>

        <aside className="summary-panel" aria-label="학습 요약">
          <h2>학습 요약</h2>
          <div className="progress-track" aria-label={`진행률 ${summary.progressPercentage}%`}>
            <span style={{ width: `${summary.progressPercentage}%` }} />
          </div>
          <dl>
            <div>
              <dt>전체 문제</dt>
              <dd>{summary.total}</dd>
            </div>
            <div>
              <dt>푼 문제</dt>
              <dd>{summary.answered}</dd>
            </div>
            <div>
              <dt>오답</dt>
              <dd>{summary.incorrect}</dd>
            </div>
            <div>
              <dt>정답률</dt>
              <dd>{summary.scorePercentage}%</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AnswerControl({
  question,
  value,
  onChange,
}: {
  question: QuizQuestion;
  value: QuizAnswer;
  onChange: (answer: QuizAnswer) => void;
}) {
  if (question.type === 'multiple-choice') {
    return (
      <fieldset className="option-list">
        <legend>답안 선택</legend>
        {question.options.map((option) => (
          <label key={option} className="option-row">
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option}
          </label>
        ))}
      </fieldset>
    );
  }

  if (question.type === 'true-false') {
    return (
      <fieldset className="option-list compact">
        <legend>참거짓 선택</legend>
        <label className="option-row">
          <input
            type="radio"
            name={question.id}
            checked={value === true}
            onChange={() => onChange(true)}
          />
          O
        </label>
        <label className="option-row">
          <input
            type="radio"
            name={question.id}
            checked={value === false}
            onChange={() => onChange(false)}
          />
          X
        </label>
      </fieldset>
    );
  }

  if (question.type === 'fill-blank') {
    return (
      <input
        className="text-answer"
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder="정답 입력"
      />
    );
  }

  if (question.type === 'short-answer') {
    return (
      <textarea
        className="text-answer multiline"
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder="짧은 문장으로 입력"
      />
    );
  }

  if (question.type === 'ordering') {
    return <OrderingAnswer question={question} value={value} onChange={onChange} />;
  }

  if (question.type === 'matching') {
    return <MatchingAnswer question={question} value={value} onChange={onChange} />;
  }

  return null;
}

function OrderingAnswer({
  question,
  value,
  onChange,
}: {
  question: OrderingQuestion;
  value: QuizAnswer;
  onChange: (answer: QuizAnswer) => void;
}) {
  const current = Array.isArray(value) ? value : [];

  return (
    <div className="stacked-control">
      {question.items.map((_, index) => (
        <label key={index}>
          {index + 1}번째
          <select
            value={current[index] ?? ''}
            onChange={(event) => {
              const next = [...current];
              next[index] = event.target.value;
              onChange(next);
            }}
          >
            <option value="">선택</option>
            {question.items.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}

function MatchingAnswer({
  question,
  value,
  onChange,
}: {
  question: MatchingQuestion;
  value: QuizAnswer;
  onChange: (answer: QuizAnswer) => void;
}) {
  const current = isRecordAnswer(value) ? value : {};

  return (
    <div className="stacked-control">
      {question.pairs.map((pair) => (
        <label key={pair.left}>
          {pair.left}
          <select
            value={current[pair.left] ?? ''}
            onChange={(event) =>
              onChange({
                ...current,
                [pair.left]: event.target.value,
              })
            }
          >
            <option value="">선택</option>
            {question.pairs.map((option) => (
              <option key={option.right} value={option.right}>
                {option.right}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}

function getEmptyAnswer(question: QuizQuestion): QuizAnswer {
  if (question.type === 'true-false') {
    return '';
  }

  if (question.type === 'ordering') {
    return [];
  }

  if (question.type === 'matching') {
    return {};
  }

  return '';
}

function isRecordAnswer(answer: QuizAnswer): answer is Record<string, string> {
  return typeof answer === 'object' && answer !== null && !Array.isArray(answer);
}
