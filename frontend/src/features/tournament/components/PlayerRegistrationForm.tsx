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
import type { CreatePlayer } from "@/types/types";
import type { StatusMessage } from "@/features/shared/types/status";

interface PlayerRegistrationFormProps {
  onSubmit: (data: CreatePlayer) => Promise<void>;
  status: StatusMessage | null;
  clearStatus: () => void;
  isSubmitting: boolean;
}

const initialForm: CreatePlayer = {
  name: "",
  email: "",
};

export default function PlayerRegistrationForm({
  onSubmit,
  status,
  clearStatus,
  isSubmitting,
}: PlayerRegistrationFormProps) {
  const [formData, setFormData] = useState<CreatePlayer>(initialForm);

  useEffect(() => {
    if (status?.type === "success") {
      setFormData(initialForm);
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (field: keyof CreatePlayer) => (value: string) => {
    if (status) {
      clearStatus();
    }

    setFormData((prev: CreatePlayer) => ({
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

      <form onSubmit={handleSubmit}>
        <VStack gap={4}>
          <Field.Root required>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Player Name
            </Field.Label>
            <Input
              value={formData.name}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleChange("name")(event.target.value)
              }
              placeholder="Enter your name"
              bg="white"
              _dark={{
                bg: "gray.700",
                borderColor: "gray.600",
                _placeholder: { color: "gray.400" },
              }}
              borderColor="gray.300"
              _placeholder={{ color: "gray.500" }}
              autoComplete="off"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="gray.700" _dark={{ color: "gray.200" }}>
              Email Address
            </Field.Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleChange("email")(event.target.value)
              }
              placeholder="Enter your email"
              bg="white"
              _dark={{
                bg: "gray.700",
                borderColor: "gray.600",
                _placeholder: { color: "gray.400" },
              }}
              borderColor="gray.300"
              _placeholder={{ color: "gray.500" }}
              autoComplete="off"
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
            disabled={!formData.name || !formData.email || isSubmitting}
            size="lg"
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
              _hover: { bg: "blue.500" },
            }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
