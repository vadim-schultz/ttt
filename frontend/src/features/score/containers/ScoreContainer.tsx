import { VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ScoreForm from "../components/ScoreForm";
import useScoreSubmission from "../hooks/useScoreSubmission";
import type { ScoreFormValues } from "../types/forms";

export default function ScoreContainer() {
  const navigate = useNavigate();
  const { submit, isSubmitting, status, error } = useScoreSubmission(() => {
    navigate("/leaderboard?success=1");
  });

  const handleSubmit = async (values: ScoreFormValues) => {
    await submit(values);
  };

  return (
    <VStack align="stretch" maxW="lg" mx="auto" py={8} gap={6}>
      <ScoreForm
        onSubmit={handleSubmit}
        status={status}
        error={error}
        isSubmitting={isSubmitting}
      />
    </VStack>
  );
}
