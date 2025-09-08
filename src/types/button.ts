import React from "react";

export interface ButtonProps {
  title?: string;
  to?: string;
  styles?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}