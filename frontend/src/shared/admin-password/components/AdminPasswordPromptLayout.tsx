import { useMemo } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  VStack,
  useToken,
} from "@chakra-ui/react";

import type { AdminPasswordPromptLayoutProps } from "./types";

export function AdminPasswordPromptLayout({
  title,
  description,
  confirmButtonText,
  confirmButtonColor,
  password,
  isLoading,
  onPasswordChange,
  onSubmit,
  onCancel,
  onKeyDown,
  errorMessage,
}: AdminPasswordPromptLayoutProps) {
  const [focusColorToken] = useToken("colors", [`${confirmButtonColor}.500`]);

  const focusColor = useMemo(
    () => focusColorToken ?? "var(--chakra-colors-blue-500)",
    [focusColorToken]
  );

  return (
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.800"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
    >
      <Box
        bg="gray.800"
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.600"
        minW="400px"
        maxW="500px"
        mx={4}
        _dark={{ bg: "gray.800", borderColor: "gray.600" }}
      >
        <VStack gap={4} align="stretch">
          <Box textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
              🔒 {title}
            </Text>
            <Text fontSize="sm" color="gray.300">
              {description}
            </Text>
          </Box>

          {errorMessage ? (
            <Box
              p={3}
              bg="red.900"
              borderRadius="md"
              borderWidth="1px"
              borderColor="red.600"
            >
              <Text color="red.100" fontSize="sm">
                ⚠️ {errorMessage}
              </Text>
            </Box>
          ) : null}

          <Box>
            <Text color="gray.300" fontSize="sm" mb={2}>
              Admin Password
            </Text>
            <Input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter admin password"
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _placeholder={{ color: "gray.400" }}
              _focus={{
                borderColor: `${confirmButtonColor}.500`,
                boxShadow: `0 0 0 1px ${focusColor}`,
              }}
              autoFocus
              disabled={isLoading}
            />
          </Box>

          <HStack justify="space-between" pt={2}>
            <Button
              variant="outline"
              colorScheme="gray"
              size="md"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme={confirmButtonColor}
              size="md"
              onClick={onSubmit}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : confirmButtonText}
            </Button>
          </HStack>

          <Box>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Press Enter to confirm, Escape to cancel
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
