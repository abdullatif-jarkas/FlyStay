import React from "react";

export interface ActionButtonProps {
  onClick: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
}

export interface ActionButtonsProps {
  actions?: ActionButtonProps[];
  compact?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  additionalActions?: ActionButtonProps[];
}