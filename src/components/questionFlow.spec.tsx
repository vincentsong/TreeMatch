import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionFlow } from './questionFlow';
import { questionStore } from '../stores/questionStore';
import { ChakraProvider, useToast } from '@chakra-ui/react';


describe('QuestionFlow', () => {
    const mockToast = vi.fn();
    let hasQuestions = true;
    beforeEach(() => {
        vi.clearAllMocks();
        (useToast as any).mockReturnValue(mockToast);
        questionStore.loading = false;
        questionStore.error = undefined;
        questionStore.match = undefined;
        questionStore.currentQuestion = {
            step_id: 1,
            question: 'Test Question',
            answers: ['Answer 1', 'Answer 2']
        };
        vi.spyOn(questionStore, 'fetchInitialQuestion').mockImplementation(async () => {
            if (!hasQuestions) return undefined;
            questionStore.currentQuestion = {
                step_id: 1,
                question: 'Test Question',
                answers: ['Answer 1', 'Answer 2']
            };
        });
        vi.spyOn(questionStore, 'submitAnswer').mockImplementation(async () => {
            if (!hasQuestions) {
                questionStore.match = {
                    name: 'Test Match',
                    description: 'Test Description'
                };
            } else {
                questionStore.currentQuestion = {
                    step_id: 1,
                    question: 'Test Question',
                    answers: ['Answer 1', 'Answer 2']
                };
            }
        });
    });



    it('should fetch initial question on mount', () => {
        render(<ChakraProvider><QuestionFlow /></ChakraProvider>);
        expect(questionStore.fetchInitialQuestion).toHaveBeenCalled();
    });

    it('should show loading state', () => {
        questionStore.loading = true;
        render(<ChakraProvider><QuestionFlow /></ChakraProvider>);
        expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();
    });
    it('should show error state when no question is available', () => {
        hasQuestions = false;
        questionStore.currentQuestion = undefined;
        render(<ChakraProvider><QuestionFlow /></ChakraProvider>);
        expect(screen.getByRole('status', { name: 'Error' })).toBeInTheDocument();
    });

    it('should show match result when available', () => {
        questionStore.match = {
            name: 'Test Match',
            description: 'Match Description'
        };
        render(<ChakraProvider><QuestionFlow /></ChakraProvider>);
        expect(screen.getByText('Test Match!')).toBeInTheDocument();
        expect(screen.getByText('Match Description')).toBeInTheDocument();
    });

    it('should handle answer selection and submission', async () => {
        render(<ChakraProvider><QuestionFlow /></ChakraProvider>);
        const radioButton = screen.getByLabelText('Answer 1');
        fireEvent.click(radioButton);

        const submitButton = screen.getByRole('button', { name: 'Submit answer' });
        expect(submitButton).toBeEnabled();

        fireEvent.click(submitButton);
        expect(questionStore.submitAnswer).toHaveBeenCalledWith('Answer 1');
    });

    it('should show error toast when error occurs', async () => {
        questionStore.error = 'Test error message';
        render(<ChakraProvider><QuestionFlow /></ChakraProvider>);
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: 'Error',
                description: 'Test error message',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
            });
        });
    });

    it('should disable submit button when no answer is selected', () => {
        render(<ChakraProvider><QuestionFlow /></ChakraProvider>);
        const submitButton = screen.getByRole('button', { name: 'Submit answer' });
        expect(submitButton).toBeDisabled();
    });
});
