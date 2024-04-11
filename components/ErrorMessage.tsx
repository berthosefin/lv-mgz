import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type ErrorMessageProps = {
  errorMessage: string;
};

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{errorMessage}</AlertTitle>
    </Alert>
  );
};

export default ErrorMessage;
