export interface Question {
    step_id: number;
    question: string;
    answers: string[];
  }
  
  export interface QuestionResponse {
    question: Question;
  }
  
  export interface AnswerRequest {
    step_id: number;
    answer: string;
  }
  
  export interface Match {
    name: string;
    description: string;
  }
  
  export interface MatchResponse {
    match: Match;
  }
  