import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Box,
  Button,
  Field,
  Input,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import AdminPasswordPrompt from "@/shared/admin-password";
import type { CreateTournament, StatusMessage } from "@/features/shared/types";

interface TournamentCreationFormProps {
  onSubmit: (payload: CreateTournament) => Promise<void>;
  status: StatusMessage | null;
  clearStatus: () => void;
  isSubmitting: boolean;
}

const defaultForm: CreateTournament = {
  name: "",
  start_date: "",
  status: "ongoing",
  rounds_count: 10,
};

export default function TournamentCreationForm({
  onSubmit,
  status,
  clearStatus,
  isSubmitting,
}: TournamentCreationFormProps) {
  const [formData, setFormData] = useState<CreateTournament>(defaultForm);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    if (status?.type === "success") {
      setFormData(defaultForm);
    }
  }, [status]);

  const handleInputChange =
    (field: keyof CreateTournament) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (status) {
        clearStatus();
      }
      const value =
        field === "rounds_count"
          ? Number.parseInt(event.target.value, 10) || 0
          : event.target.value;

      setFormData((prev: CreateTournament) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.start_date) {
      return;
    }

    setShowPasswordPrompt(true);
  };

  const handleConfirm = async () => {
    try {
      await onSubmit(formData);
    } finally {
      setShowPasswordPrompt(false);
    }
  };

  const handleCancel = () => {
    setShowPasswordPrompt(false);
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

      <form onSubmit={handleSubmit}>
        <VStack gap={4}>
          <Field.Root required>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Tournament Name
            </Field.Label>
            <Input
              value={formData.name}
              onChange={handleInputChange("name")}
              placeholder="Enter tournament name"
              bg="white"
              _dark={{
                bg: "gray.700",
                borderColor: "gray.600",
                _placeholder: { color: "gray.400" },
              }}
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
              onChange={handleInputChange("start_date")}
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
              value={formData.rounds_count ?? 0}
              onChange={handleInputChange("rounds_count")}
              bg="white"
              _dark={{ bg: "gray.700", borderColor: "gray.600" }}
              borderColor="gray.300"
            />
          </Field.Root>

          {status && (
            <Text color={status.type === "success" ? "green.500" : "red.500"}>
              {status.text}
            </Text>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            loading={isSubmitting}
            width="full"
            disabled={!formData.name || !formData.start_date || isSubmitting}
            size="lg"
            _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
          >
            {isSubmitting ? "Creating..." : "Create Tournament"}
          </Button>
        </VStack>
      </form>

      {showPasswordPrompt && (
        <AdminPasswordPrompt
          title="Create Tournament - Admin Authentication Required"
          description={`Please enter the admin password to create the tournament "${formData.name}". This action requires admin authorization.`}
          confirmButtonText="Create Tournament"
          confirmButtonColor="blue"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      )}
    </Box>
  );
}
