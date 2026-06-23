"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/use-cart";

export function AddToCartButton({
  slug,
  name,
  brand,
  price,
}: {
  slug: string;
  name: string;
  brand: string;
  price: number;
}) {
  const { addItem } = useCart();

  return (
    <Button
      size="lg"
      className="flex-1 rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={() => {
        addItem({ slug, name, brand, price, quantity: 1 });
        alert("已加入購物車");
      }}
    >
      <ShoppingBag className="h-5 w-5" />
      加入購物車
    </Button>
  );
}
