import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Box, Heading, RadioGroup, Radio, Text, VStack, useToast, Button } from "@chakra-ui/react";
import { questionStore } from "../stores/questionStore";

export const QuestionFlow = observer(() => {

    const toast = useToast();
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');

    useEffect(() => {
        questionStore.fetchInitialQuestion();
    }, []);

    useEffect(() => {
        if (questionStore.error) {
            toast({
                title: "Error",
                description: questionStore.error,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    }, [toast]);

    const handleSubmit = () => {
        questionStore.submitAnswer(selectedAnswer);
        setSelectedAnswer('');
    };

    if (questionStore.loading) {
        return (
            <Box p={4} role="status" aria-label="Loading...">
                <Text>Loading...</Text>
            </Box>
        )
    }
    if (questionStore.match) {
        return (
            <Box p={4}>
                <Heading size="lg" mb={4}>{questionStore.match.name}!</Heading>
                <Text>{questionStore.match.description}</Text>
            </Box>
        )
    } else if (!questionStore.currentQuestion) {
        return (
            <Box p={4} role="status" aria-label="Error">
                <Text>Error: cannot get question</Text>
            </Box>
        )
    }

    return (
        <Box p={4} bg="white" mx="auto" h="100vh" display="flex" flexDirection="column">
            <Box>
                <Heading size="lg" fontSize={{ base: '1.75rem', md: '1.5rem' }}>
                    {questionStore.currentQuestion.question}
                </Heading>
            </Box>
            <Box flex="1" overflow="auto" px={4} pt={8} my={4}>
                <RadioGroup value={selectedAnswer} onChange={setSelectedAnswer}>
                    <VStack spacing={{ base: 12, md: 6 }} align="stretch">
                        {questionStore.currentQuestion.answers.map((answer) => (
                            <Radio key={answer} value={answer} size="lg"
                                fontSize={{ base: "1.5rem", md: "1rem" }}>
                                {answer}
                            </Radio>
                        ))}
                    </VStack>
                </RadioGroup>
            </Box>
            <Box p={4}>
                <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleSubmit}
                    fontSize={{ base: '1.75rem', md: '1.25rem' }}
                    isDisabled={!selectedAnswer}
                    aria-label="Submit answer">
                    Submit Answer
                </Button>
            </Box>
        </Box >

    )
});