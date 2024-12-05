import axios from 'axios';
import { QuestionResponse, AnswerRequest, MatchResponse } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getInitialQuestion = async (): Promise<QuestionResponse> => {
  const response = await api.get<QuestionResponse>('/api/begin');
  return response.data;
};

export const submitAnswer = async (data: AnswerRequest): Promise<QuestionResponse | MatchResponse> => {
  const response = await api.post('/api/answer', data);
  return response.data;
};
