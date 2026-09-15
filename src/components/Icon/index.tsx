import * as React from "react";
import { ICON_MAP, type IconName } from "../../lib/icons";

export type { IconName };

export interface IconProps {
  name: IconName;
  size?: "xs" | "sm" | "md";
  tone?: "primary" | "secondary" | "tertiary";
  strokeWidth?: number;
  className?: string;
}

const SIZE_PX: Record<string, number> = { xs: 10, sm: 14, md: 18 };

const TONE_CLASS: Record<string, string> = {
  primary: "text-ak-content",
  secondary: "text-ak-content-secondary",
  tertiary: "text-ak-content-tertiary",
};

export function Icon({
  name,
  size = "sm",
  tone = "secondary",
  strokeWidth = 2,
  className,
}: IconProps) {
  const Cmp = ICON_MAP[name];
  if (!Cmp) return null;
  return (
    <Cmp
      size={SIZE_PX[size]}
      strokeWidth={strokeWidth}
      className={`${TONE_CLASS[tone] ?? ""} ${className ?? ""}`}
    />
  );
}
