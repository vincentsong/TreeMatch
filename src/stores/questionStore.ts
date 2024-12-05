import { makeAutoObservable, runInAction } from "mobx";
import { Question, Match } from "../types";
import { getInitialQuestion, submitAnswer } from "../services/api";

export class QuestionStore {
  currentQuestion?: Question;
  match?: Match;
  error?: string;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchInitialQuestion() {
    this.loading = true;
    try {
      const response = await getInitialQuestion();
      runInAction(() => {
        this.currentQuestion = response.question;
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to fetch initial question";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async submitAnswer(answer: string) {
    if (!this.currentQuestion) {
      throw new Error("No current question to answer");
    }
    this.loading = true;
    try {
      const response = await submitAnswer({
        step_id: this.currentQuestion.step_id,
        answer,
      });

      runInAction(() => {
        if ('match' in response && response.match) {
          this.match = response.match;
          this.currentQuestion = undefined;
        } else if ('question' in response && response.question) {
          this.currentQuestion = response.question;
        } else {
          this.error = "Unexpected response from server";
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      runInAction(() => {
        this.error = "Failed to submit answer";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const questionStore = new QuestionStore();