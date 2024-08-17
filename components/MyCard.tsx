import { Ban } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
};

const MyCard = ({ title, value, description, icon }: Props) => {
  const renderIcon = (icon: React.ReactNode | undefined) => {
    return icon ? icon : <Ban />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="h-4 w-4 text-muted-foreground">
          {renderIcon(icon)}
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MyCard;
