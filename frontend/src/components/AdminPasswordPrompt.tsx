import { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";

interface AdminPasswordPromptProps {
  title: string;
  description: string;
  confirmButtonText: string;
  confirmButtonColor?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Admin password - comes from environment variables
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export default function AdminPasswordPrompt({
  title,
  description,
  confirmButtonText,
  confirmButtonColor = "blue",
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminPasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect admin password");
      setPassword("");
      return;
    }

    setError("");
    await onConfirm();
  };

  const handleCancel = () => {
    setPassword("");
    setError("");
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.800"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1000"
    >
      <Box
        bg="gray.800"
        p={6}
        borderRadius="lg"
        border="1px solid"
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

          {error && (
            <Box
              p={3}
              bg="red.900"
              borderRadius="md"
              border="1px solid"
              borderColor="red.600"
            >
              <Text color="red.100" fontSize="sm">
                ⚠️ {error}
              </Text>
            </Box>
          )}

          <Box>
            <Text color="gray.300" fontSize="sm" mb={2}>
              Admin Password
            </Text>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter admin password"
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _placeholder={{ color: "gray.400" }}
              _focus={{ 
                borderColor: confirmButtonColor + ".500",
                boxShadow: `0 0 0 1px var(--chakra-colors-${confirmButtonColor}-500)`
              }}
              autoFocus
            />
          </Box>

          <HStack justify="space-between" pt={2}>
            <Button
              variant="outline"
              colorScheme="gray"
              size="md"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme={confirmButtonColor}
              size="md"
              onClick={handleSubmit}
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