import { type JSX } from "react";
import { cn } from "@perfectest/shared";

export interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

export function Code({ children, className }: CodeProps): JSX.Element {
  return <code className={cn(className)}>{children}</code>;
}

