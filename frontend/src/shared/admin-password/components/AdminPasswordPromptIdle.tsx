import type { AdminPasswordPromptCommonProps } from "./types";
import { AdminPasswordPromptLayout } from "./AdminPasswordPromptLayout";

export function AdminPasswordPromptIdle(props: AdminPasswordPromptCommonProps) {
  return <AdminPasswordPromptLayout {...props} />;
}
