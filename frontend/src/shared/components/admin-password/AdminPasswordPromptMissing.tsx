import { PASSWORD_REQUIRED_MESSAGE } from "./constants";
import type { AdminPasswordPromptCommonProps } from "./types";
import { AdminPasswordPromptLayout } from "./AdminPasswordPromptLayout";

export function AdminPasswordPromptMissing(
  props: AdminPasswordPromptCommonProps
) {
  return (
    <AdminPasswordPromptLayout
      {...props}
      errorMessage={PASSWORD_REQUIRED_MESSAGE}
    />
  );
}
