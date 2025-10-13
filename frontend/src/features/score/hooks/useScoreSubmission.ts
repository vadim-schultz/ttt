import { useCallback, useState } from "react";
import type { StatusMessage } from "@/features/shared/types/status";
import { submitScore } from "../services/scoreApi";
import type { ScoreFormValues } from "../types/forms";

interface UseScoreSubmissionResult {
  submit: (values: ScoreFormValues) => Promise<void>;
  isSubmitting: boolean;
  status: StatusMessage | null;
  error: string | null;
}

export default function useScoreSubmission(
  onSuccess?: () => void
): UseScoreSubmissionResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: ScoreFormValues) => {
      setIsSubmitting(true);
      setError(null);
      setStatus(null);

      try {
        await submitScore(values);
        setStatus({ type: "success", text: "Score updated successfully" });
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update score";
        setError(message);
        setStatus({ type: "error", text: message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess]
  );

  return {
    submit,
    isSubmitting,
    status,
    error,
  };
}
