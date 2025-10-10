import { useState, type FormEvent, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Field,
  Input,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import AdminPasswordPrompt from "@/components/AdminPasswordPrompt";
import type { CreateTournament, Tournament } from "@/types/types";

interface TournamentCreationFormProps {
  onTournamentCreated: (tournament: Tournament) => void;
}

export default function TournamentCreationForm({ onTournamentCreated }: TournamentCreationFormProps) {
  const [formData, setFormData] = useState<CreateTournament>({
    name: "",
    start_date: "",
    status: "ongoing",
    rounds_count: 10,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement | HTMLDivElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.start_date) return;
    
    setShowPasswordPrompt(true);
  };

  const handlePasswordConfirmed = async () => {
    setLoading(true);
    setMessage(null);
    setShowPasswordPrompt(false);

    try {
  const response = await fetch("/api/tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create tournament");
      }

      const tournament = await response.json();
      onTournamentCreated(tournament);
      
      // Reset form
      setFormData({
        name: "",
        start_date: "",
        status: "ongoing",
        rounds_count: 10,
      });

      setMessage({
        type: 'success',
        text: `Tournament "${tournament.name}" has been created successfully.`
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: "Failed to create tournament. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
  };

  const handleInputChange = (field: keyof CreateTournament, value: string | number) => {
    setFormData((prev: CreateTournament) => ({
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
        Create New Tournament
      </Heading>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={4}>
          <Field.Root required>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Tournament Name
            </Field.Label>
            <Input
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
              placeholder="Enter tournament name"
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600", _placeholder: { color: "gray.400" } }}
              borderColor="gray.300"
              _placeholder={{ color: "gray.500" }}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Start Date
            </Field.Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("start_date", e.target.value)}
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600" }}
              borderColor="gray.300"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Number of Rounds
            </Field.Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={formData.rounds_count}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("rounds_count", parseInt(e.target.value, 10) || 10)}
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600" }}
              borderColor="gray.300"
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
            disabled={!formData.name || !formData.start_date || loading}
            size="lg"
            _disabled={{ 
              opacity: 0.6,
              cursor: "not-allowed"
            }}
          >
            {loading ? "Creating..." : "Create Tournament"}
          </Button>
        </VStack>
      </Box>

      {/* Admin Password Prompt */}
      {showPasswordPrompt && (
        <AdminPasswordPrompt
          title="Create Tournament - Admin Authentication Required"
          description={`Please enter the admin password to create the tournament "${formData.name}". This action requires admin authorization.`}
          confirmButtonText="Create Tournament"
          confirmButtonColor="blue"
          onConfirm={handlePasswordConfirmed}
          onCancel={handlePasswordCancel}
          isLoading={loading}
        />
      )}
    </Box>
  );
}