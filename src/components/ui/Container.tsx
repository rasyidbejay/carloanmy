import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("w-full px-6 xl:px-10", className)}
      {...props}
    />
  );
}
