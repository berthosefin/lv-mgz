"use client"; // Error components must be Client Components

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col gap-2 p-24 max-w-lg">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Une erreur s'est produite !</AlertDescription>
      </Alert>
      <Button
        variant={"outline"}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Essayer à nouveau
      </Button>
    </div>
  );
}
