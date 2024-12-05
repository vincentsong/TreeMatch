import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuestionStore } from './questionStore';
import { getInitialQuestion, submitAnswer } from '../services/api';
import { Question, Match } from '../types';

vi.mock('../services/api');

describe('QuestionStore', () => {
  let store: QuestionStore;
  const mockQuestion: Question = {
    step_id: 1,
    question: 'Test question?',
    answers: ['A', 'B', 'C']
  };
  const mockMatch: Match = {
    name: 'Palm Tree',
    description: 'complete'
  };

  beforeEach(() => {
    store = new QuestionStore();
    vi.clearAllMocks();
  });

  describe('fetchInitialQuestion', () => {
    it('should set currentQuestion on successful fetch', async () => {
      vi.mocked(getInitialQuestion).mockResolvedValue({ question: mockQuestion });
      
      await store.fetchInitialQuestion();
      
      expect(store.currentQuestion).toEqual(mockQuestion);
      expect(store.loading).toBe(false);
      expect(store.error).toBeUndefined();
    });

    it('should set error on failed fetch', async () => {
      vi.mocked(getInitialQuestion).mockRejectedValue(new Error('API Error'));
      
      await store.fetchInitialQuestion();
      
      expect(store.error).toBe('Failed to fetch initial question');
      expect(store.loading).toBe(false);
      expect(store.currentQuestion).toBeUndefined();
    });
  });

  describe('submitAnswer', () => {
    it('should update store with match on match response', async () => {
      store.currentQuestion = mockQuestion;
      vi.mocked(submitAnswer).mockResolvedValue({ match: mockMatch });
      
      await store.submitAnswer('test answer');
      
      expect(store.match).toEqual(mockMatch);
      expect(store.currentQuestion).toBeUndefined();
      expect(store.loading).toBe(false);
    });

    it('should update current question on question response', async () => {
      const nextQuestion = { ...mockQuestion, step_id: 2 };
      store.currentQuestion = mockQuestion;
      vi.mocked(submitAnswer).mockResolvedValue({ question: nextQuestion });
      
      await store.submitAnswer('test answer');
      
      expect(store.currentQuestion).toEqual(nextQuestion);
      expect(store.match).toBeUndefined();
      expect(store.loading).toBe(false);
    });

    it('should set error on unexpected response', async () => {
      store.currentQuestion = mockQuestion;
      vi.mocked(submitAnswer).mockResolvedValue({} as any);
      
      await store.submitAnswer('test answer');
      
      expect(store.error).toBe('Unexpected response from server');
      expect(store.loading).toBe(false);
    });

    it('should set error on failed submission', async () => {
      store.currentQuestion = mockQuestion;
      vi.mocked(submitAnswer).mockRejectedValue(new Error('API Error'));
      
      await store.submitAnswer('test answer');
      
      expect(store.error).toBe('Failed to submit answer');
      expect(store.loading).toBe(false);
    });
  });
});
