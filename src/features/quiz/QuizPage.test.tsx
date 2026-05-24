// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { QuizPage } from './QuizPage';

describe('QuizPage', () => {
  it('lets a user answer a question and read the explanation', async () => {
    const user = userEvent.setup();

    render(<QuizPage />);

    expect(screen.getByRole('heading', { name: '쿠버네티스 퀴즈' })).toBeInTheDocument();
    expect(screen.getByText('쿠버네티스에서 클러스터(Cluster)를 가장 정확히 설명한 것은?')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '여러 노드로 구성된 쿠버네티스의 운영 단위' }));
    await user.click(screen.getByRole('button', { name: '채점하기' }));

    expect(screen.getByText('정답입니다')).toBeInTheDocument();
    expect(screen.getByText(/클러스터를 쿠버네티스의 전체 구성 단위/)).toBeInTheDocument();
  });
});
