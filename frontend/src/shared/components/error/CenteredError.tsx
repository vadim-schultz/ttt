import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";

import CenteredContainer from "@/components/ui/CenteredContainer";

interface CenteredErrorProps {
  title: string;
  message?: string | null;
  actionLabel?: string;
  onAction?: () => void;
  height?: string | number;
}

export default function CenteredError({
  title,
  message,
  actionLabel,
  onAction,
  height = "300px",
}: CenteredErrorProps) {
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
