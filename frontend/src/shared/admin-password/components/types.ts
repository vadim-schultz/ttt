import type { KeyboardEvent } from "react";

export interface AdminPasswordPromptCommonProps {
  title: string;
  description: string;
  confirmButtonText: string;
  confirmButtonColor: string;
  password: string;
  isLoading: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export interface AdminPasswordPromptLayoutProps
  extends AdminPasswordPromptCommonProps {
  errorMessage?: string;
}
