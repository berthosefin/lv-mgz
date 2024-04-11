import { Ban } from "lucide-react";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type Props = {
  title: string;
  value: string;
  icon?: React.ReactNode;
};

const MyCard = ({ title, value, icon }: Props) => {
  const renderIcon = (icon: React.ReactNode | undefined) => {
    return icon ? icon : <Ban />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {renderIcon(icon)} <span className="card-title">{value}</span>
        </CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MyCard;
