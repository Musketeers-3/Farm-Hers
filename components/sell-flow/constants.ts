import { Wheat, Sprout, Leaf } from "lucide-react";

export const cropIcons: Record<string, any> = {
  wheat: Wheat,
  rice: Wheat,
  mustard: Sprout,
  corn: Leaf,
  potato: Sprout,
  onion: Leaf,
};

export const cropImages: Record<string, string> = {
  wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
  mustard:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop",
  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82ber95?w=400&h=400&fit=crop",
  onion:
    "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
};

export type SellStep =
  | "select-crop"
  | "enter-quantity"
  | "choose-method"
  | "pool-details"
  | "confirm";

export const stepOrder: SellStep[] = [
  "select-crop",
  "enter-quantity",
  "choose-method",
  "pool-details",
  "confirm",
];
