import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import CenteredContainer from "./CenteredContainer";

interface LoadingStateProps {
  message?: string;
  height?: string | number;
  spinnerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  spinnerColor?: string;
}

export default function LoadingState({
  message = "Loading...",
  height = "300px",
  spinnerSize = "xl",
  spinnerColor = "blue.400",
}: LoadingStateProps) {
  return (
    <CenteredContainer>
      <Center h={height}>
        <VStack gap={4}>
          <Spinner size={spinnerSize} color={spinnerColor} />
          <Text color="gray.400" fontSize="lg">
            {message}
          </Text>
        </VStack>
      </Center>
    </CenteredContainer>
  );
}
