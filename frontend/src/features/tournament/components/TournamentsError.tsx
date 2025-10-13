import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { CenteredContainer } from "@/shared/ui";

interface TournamentsErrorProps {
  message: string;
  onRetry: () => void;
}

export default function TournamentsError({
  message,
  onRetry,
}: TournamentsErrorProps) {
  return (
    <CenteredContainer>
      <Box
        w="100%"
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        borderColor="red.300"
      >
        <VStack gap={2}>
          <Text color="red.500" fontWeight="semibold">
            Couldn't load tournaments
          </Text>
          <Text color="red.400" fontSize="sm" textAlign="center">
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
      </Box>
    </CenteredContainer>
  );
}
