import { useCallback, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";

import { AdminPasswordPromptIdle } from "@/shared/components/admin-password/AdminPasswordPromptIdle";
import { AdminPasswordPromptIncorrect } from "@/shared/components/admin-password/AdminPasswordPromptIncorrect";
import { AdminPasswordPromptMissing } from "@/shared/components/admin-password/AdminPasswordPromptMissing";
import type { AdminPasswordPromptCommonProps } from "@/shared/components/admin-password/types";

export interface AdminPasswordPromptProps {
  title: string;
  description: string;
  confirmButtonText: string;
  confirmButtonColor?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type PromptView = "idle" | "missing" | "incorrect";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

function AdminPasswordPromptContainer({
  title,
  description,
  confirmButtonText,
  confirmButtonColor = "blue",
  onConfirm,
  onCancel,
  isLoading = false,
}: AdminPasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [view, setView] = useState<PromptView>("idle");

  const resetState = useCallback(() => {
    setPassword("");
    setView("idle");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (password.trim() === "") {
      setView("missing");
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setView("incorrect");
      setPassword("");
      return;
    }

    setView("idle");
    await onConfirm();
    resetState();
  }, [password, onConfirm, isLoading, resetState]);

  const handleCancel = useCallback(() => {
    if (isLoading) {
      return;
    }

    resetState();
    onCancel();
  }, [onCancel, resetState, isLoading]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (isLoading) {
        return;
      }

      if (event.key === "Enter") {
        handleSubmit();
      }

      if (event.key === "Escape") {
        handleCancel();
      }
    },
    [handleSubmit, handleCancel, isLoading]
  );

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    setView("idle");
  }, []);

  const presentationalProps: AdminPasswordPromptCommonProps = useMemo(
    () => ({
      title,
      description,
      confirmButtonText,
      confirmButtonColor,
      password,
      isLoading,
      onPasswordChange: handlePasswordChange,
      onSubmit: handleSubmit,
      onCancel: handleCancel,
      onKeyDown: handleKeyDown,
    }),
    [
      title,
      description,
      confirmButtonText,
      confirmButtonColor,
      password,
      isLoading,
      handlePasswordChange,
      handleSubmit,
      handleCancel,
      handleKeyDown,
    ]
  );

  switch (view) {
    case "missing":
      return <AdminPasswordPromptMissing {...presentationalProps} />;
    case "incorrect":
      return <AdminPasswordPromptIncorrect {...presentationalProps} />;
    default:
      return <AdminPasswordPromptIdle {...presentationalProps} />;
  }
}

export default AdminPasswordPromptContainer;
export { AdminPasswordPromptContainer };
