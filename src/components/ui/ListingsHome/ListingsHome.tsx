import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../Button/button";
import { Text } from "../Text/text";

export default function ListingsHome({
  children,
  title,
  seeAllLink,
  className,
}: {
  children: React.ReactNode;
  title: string;
  seeAllLink: string;
  className?: string;
}) {
  return (
    <div className={cn("container", className)}>
      <div className="mb-6 flex items-center justify-between">
        <Text className="text-2xl font-medium">{title}</Text>
        <Button
          type="button"
          className="text-lg font-normal text-neutral"
          onClick={() => (window.location.href = seeAllLink)}
        >
          see all
        </Button>{" "}
        {/* Simple navigation to see all listings //* i will change it for Link */}
      </div>
      <div className="grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
}
