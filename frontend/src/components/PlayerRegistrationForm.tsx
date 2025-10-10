import { useState } from "react";
import {
  Box,
  Button,
  Field,
  Input,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import type { CreatePlayer, Player } from "@/types/types";

interface PlayerRegistrationFormProps {
  tournamentId: string;
  onPlayerRegistered: (player: Player) => void;
}

export default function PlayerRegistrationForm({ tournamentId, onPlayerRegistered }: PlayerRegistrationFormProps) {
  const [formData, setFormData] = useState<CreatePlayer>({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/tournament/${tournamentId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to register player");
      }

      const player = await response.json();
      onPlayerRegistered(player);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
      });

      setMessage({
        type: 'success',
        text: `Player "${player.name}" has been registered successfully.`
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : "Failed to register player. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreatePlayer, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={6}
      borderColor="gray.200"
      _dark={{ borderColor: "gray.600", bg: "gray.800" }}
      bg="white"
    >
      <Heading size="md" mb={4} color="gray.800" _dark={{ color: "white" }}>
        Register for Tournament
      </Heading>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={4}>
          <Field.Root required>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Player Name
            </Field.Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600", _placeholder: { color: "gray.400" } }}
              borderColor="gray.300"
              _placeholder={{ color: "gray.500" }}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Email Address
            </Field.Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600", _placeholder: { color: "gray.400" } }}
              borderColor="gray.300"
              _placeholder={{ color: "gray.500" }}
            />
          </Field.Root>

          {message && (
            <Text color={message.type === 'success' ? 'green.500' : 'red.500'}>
              {message.text}
            </Text>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            loading={loading}
            width="full"
            disabled={!formData.name || !formData.email || loading}
            size="lg"
            _disabled={{ 
              opacity: 0.6,
              cursor: "not-allowed",
              _hover: { bg: "blue.500" }
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}