import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { CenteredContainer } from "@/shared/ui";

interface TournamentErrorProps {
  message: string | null;
  onRetry: () => void;
}

export default function TournamentError({
  message,
  onRetry,
}: TournamentErrorProps) {
  return (
    <CenteredContainer>
      <Center h="300px">
        <VStack gap={3}>
          <Heading size="md" color="red.300">
            Unable to load tournament
          </Heading>
          <Text color="red.200" textAlign="center">
            {message}
          </Text>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={onRetry}
          >
            Retry
          </Button>
        </VStack>
      </Center>
    </CenteredContainer>
  );
}
