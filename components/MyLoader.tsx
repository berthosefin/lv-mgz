import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const MyLoader = ({ className }: { className?: string }) => {
  return (
    <span className="flex justify-center mt-4">
      <Loader2 className={cn("text-primary/60 animate-spin", className)} />
    </span>
  );
};

export default MyLoader;
