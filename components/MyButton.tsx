"use client";

import { Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  label: string;
  loading: boolean;
  errorMessage: string | null;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

const MyButton = ({
  label,
  loading,
  errorMessage,
  icon,
  type = "submit",
}: Props) => {
  const renderIcon = (icon: React.ReactNode | undefined) => {
    return icon ? icon : <Check className="mr-2 h-4 w-4" />;
  };

  return (
    <>
      {loading ? (
        <Button disabled className="w-full mt-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement
        </Button>
      ) : (
        <Button
          disabled={errorMessage ? true : false}
          type={type}
          className="w-full mt-4"
        >
          {renderIcon(icon)}
          {label}
        </Button>
      )}
    </>
  );
};

export default MyButton;
