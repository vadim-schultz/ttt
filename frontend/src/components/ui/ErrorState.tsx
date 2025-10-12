import {
  Alert,
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import CenteredContainer from "./CenteredContainer";

type ErrorStateLayout = "centered" | "card" | "alert";

interface ErrorStateProps {
  title?: string;
  message?: string | null;
  layout?: ErrorStateLayout;
  onAction?: () => void;
  actionLabel?: string;
  height?: string | number;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  layout = "centered",
  onAction,
  actionLabel = "Retry",
  height = "300px",
}: ErrorStateProps) {
  if (layout === "alert") {
    return (
      <CenteredContainer>
        <Alert.Root
          status="error"
          bg="red.900"
          borderColor="red.600"
          color="red.100"
        >
          <Alert.Indicator />
          <Box>
            <Alert.Title>{title}</Alert.Title>
            {message && <Alert.Description>{message}</Alert.Description>}
          </Box>
        </Alert.Root>
      </CenteredContainer>
    );
  }

  if (layout === "card") {
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
              {title}
            </Text>
            {message && (
              <Text color="red.400" fontSize="sm" textAlign="center">
                {message}
              </Text>
            )}
            {onAction && (
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            )}
          </VStack>
        </Box>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <Center h={height}>
        <VStack gap={3}>
          <Heading size="md" color="red.300" textAlign="center">
            {title}
          </Heading>
          {message && (
            <Text color="red.200" textAlign="center">
              {message}
            </Text>
          )}
          {onAction && (
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </VStack>
      </Center>
    </CenteredContainer>
  );
}
