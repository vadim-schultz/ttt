import AlertError from "./AlertError";
import CardError from "./CardError";
import CenteredError from "./CenteredError";

type ErrorStateLayout = "centered" | "card" | "alert";

interface ErrorStateProps {
  title?: string;
  message?: string | null;
  layout?: ErrorStateLayout;
  onAction?: () => void;
  actionLabel?: string;
  height?: string | number;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  layout = "centered",
  onAction,
  actionLabel = "Retry",
  height = "300px",
}: ErrorStateProps) {
  switch (layout) {
    case "alert":
      return <AlertError title={title} message={message} />;
    case "card":
      return (
        <CardError
          title={title}
          message={message}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      );
    default:
      return (
        <CenteredError
          title={title}
          message={message}
          actionLabel={actionLabel}
          onAction={onAction}
          height={height}
        />
      );
  }
}
