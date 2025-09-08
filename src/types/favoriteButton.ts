export interface FavoriteButtonProps {
  type: "hotel" | "room" | "flight";
  id: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}