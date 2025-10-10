import type { FormEvent } from "react";
import { Button, Field, Input, VStack, Alert, Text } from "@chakra-ui/react";
import type { StatusMessage } from "@/features/shared/types/status";
import type { ScoreFormValues } from "../types/forms";

interface ScoreFormProps {
  onSubmit: (values: ScoreFormValues) => void | Promise<void>;
  status?: StatusMessage | null;
  error?: string | null;
  isSubmitting?: boolean;
}

export default function ScoreForm({
  onSubmit,
  status,
  error,
  isSubmitting,
}: ScoreFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values: ScoreFormValues = {
      matchId: (formData.get("match_id")?.toString() ?? "").trim(),
      team1Id: (formData.get("team1_id")?.toString() ?? "").trim(),
      team1Score: Number(formData.get("team1_score") ?? 0),
      team2Id: (formData.get("team2_id")?.toString() ?? "").trim(),
      team2Score: Number(formData.get("team2_score") ?? 0),
    };

    void onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" maxW="md" gap={4}>
        {(status || error) && (
          <Alert.Root status={status?.type === "success" ? "success" : "error"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{status?.text ?? "Submission failed"}</Alert.Title>
              {error && status?.type !== "success" && (
                <Alert.Description>{error}</Alert.Description>
              )}
            </Alert.Content>
          </Alert.Root>
        )}

        <Field.Root required>
          <Field.Label>Match ID</Field.Label>
          <Input
            name="match_id"
            placeholder="Enter match identifier"
            disabled={isSubmitting}
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Team 1 ID</Field.Label>
          <Input
            name="team1_id"
            placeholder="Team 1 identifier"
            disabled={isSubmitting}
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Team 1 Score</Field.Label>
          <Input
            name="team1_score"
            type="number"
            min={0}
            disabled={isSubmitting}
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Team 2 ID</Field.Label>
          <Input
            name="team2_id"
            placeholder="Team 2 identifier"
            disabled={isSubmitting}
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Team 2 Score</Field.Label>
          <Input
            name="team2_score"
            type="number"
            min={0}
            disabled={isSubmitting}
          />
        </Field.Root>

        <Button
          type="submit"
          colorScheme="teal"
          loading={isSubmitting}
          loadingText="Submitting"
        >
          Update Score
        </Button>

        <Text fontSize="sm" color="gray.500">
          Scores are immediately reflected on the leaderboard after submission.
        </Text>
      </VStack>
    </form>
  );
}
