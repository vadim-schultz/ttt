// components/ScoreForm.tsx
import type { FormEvent } from "react";
import {
  Button,
  Field,
  Input,
  VStack,
} from "@chakra-ui/react";

interface ScoreFormProps {
  onSubmit: (formData: FormData) => void;
  errorMessage?: string; // optional error indicator
}

export default function ScoreForm({ onSubmit }: ScoreFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" maxW="md">
        <Field.Root required>
          <Field.Label>Match ID</Field.Label>
          <Input name="match_id" />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Team 1 ID</Field.Label>
          <Input name="team1_id" />
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Team 1 Score
          </Field.Label>
          <Input name="team1_score" type="number" />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Team 2 ID</Field.Label>
          <Input name="team2_id" />
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Team 2 Score
          </Field.Label>
          <Input name="team2_score" type="number" />
        </Field.Root>

        <Button type="submit" colorScheme="teal">
          Update Score
        </Button>
      </VStack>
    </form>
  );
}
