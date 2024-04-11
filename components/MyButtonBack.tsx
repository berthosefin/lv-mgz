import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

type Props = {
  path: string;
  name: string;
  icon?: React.ReactNode;
};

const MyButtonBack = ({ path, name, icon }: Props) => {
  const renderIcon = (icon: React.ReactNode | undefined) => {
    return icon ? icon : <MoveLeft size={10} className="mr-2" />;
  };

  return (
    <Button variant={"link"} asChild>
      <Link href={path} className="flex">
        {renderIcon(icon)}
        {name}
      </Link>
    </Button>
  );
};

export default MyButtonBack;
