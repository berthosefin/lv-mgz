import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <span className="flex justify-center mt-4">
      <Loader2 className="text-primary/60 animate-spin" />
    </span>
  );
}
