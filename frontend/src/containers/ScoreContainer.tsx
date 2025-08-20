// containers/ScoreContainer.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VStack, Alert } from "@chakra-ui/react";
import ScoreForm from "@/components/ScoreForm";

export default function ScoreContainer() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(formData: FormData) {
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update score");

      // backend redirects to /leaderboard, so we do the same
      navigate("/leaderboard?success=1");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <VStack>
      {error && (
        <Alert.Root status="error">{error}</Alert.Root>
      )}
      <ScoreForm onSubmit={handleSubmit} />
    </VStack>
  );
}
