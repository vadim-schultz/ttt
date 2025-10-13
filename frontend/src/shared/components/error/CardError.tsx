import { Box, Button, Text, VStack } from "@chakra-ui/react";

import CenteredContainer from "@/components/ui/CenteredContainer";

interface CardErrorProps {
  title: string;
  message?: string | null;
  actionLabel?: string;
  onAction?: () => void;
}

export default function CardError({
  title,
  message,
  actionLabel,
  onAction,
}: CardErrorProps) {
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
