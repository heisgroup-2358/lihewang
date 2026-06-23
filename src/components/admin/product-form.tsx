"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Category = { id: string; name: string; slug: string; image: string | null };

type ProductFormProps = {
  categories: Category[];
  product?: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    origin: string;
    categoryId: string;
    description: string;
    details: string;
    images: string;
    retailPrice: number;
    wholesalePriceL1: number;
    wholesalePriceL2: number;
    costPrice: number;
    stock: number;
    badge: string | null;
  };
};

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [manualSlug, setManualSlug] = useState<string | null>(null);
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [origin, setOrigin] = useState(product?.origin ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [retailPrice, setRetailPrice] = useState(product?.retailPrice.toString() ?? "");
  const [wholesalePriceL1, setWholesalePriceL1] = useState(product?.wholesalePriceL1.toString() ?? "");
  const [wholesalePriceL2, setWholesalePriceL2] = useState(product?.wholesalePriceL2.toString() ?? "");
  const [costPrice, setCostPrice] = useState(product?.costPrice.toString() ?? "");
  const [stock, setStock] = useState(product?.stock.toString() ?? "0");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [images, setImages] = useState<string[]>(() => {
    try {
      return product?.images ? JSON.parse(product.images) : [];
    } catch {
      return [];
    }
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const slug = manualSlug ?? (isEdit ? product!.slug : toSlug(name));
  const isSlugAuto = manualSlug === null && !isEdit;

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImages((prev) => [...prev, data.url]);
    } catch {
      alert("上傳圖片失敗");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const body = {
      name,
      slug,
      brand,
      origin,
      categoryId,
      description,
      details: "[]",
      images: JSON.stringify(images),
      retailPrice: Number(retailPrice),
      wholesalePriceL1: Number(wholesalePriceL1),
      wholesalePriceL2: Number(wholesalePriceL2),
      costPrice: Number(costPrice),
      stock: Number(stock),
      badge: badge || null,
    };

    try {
      const url = isEdit ? `/api/products/${product!.slug}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch {
      alert("儲存產品失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本資訊</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">產品名稱</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
              <div className="space-y-1.5">
                  <label className="text-sm font-medium">Slug</label>
                  <div className="flex gap-2">
                    <Input
                      value={slug}
                      onChange={(e) => setManualSlug(e.target.value)}
                      readOnly={isSlugAuto}
                      className={isSlugAuto ? "opacity-60" : ""}
                      required
                    />
                    {isEdit ? null : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setManualSlug(isSlugAuto ? toSlug(name) : null)}
                      >
                        {isSlugAuto ? "編輯" : "自動"}
                      </Button>
                    )}
                  </div>
                </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">品牌</label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">產地</label>
              <Input value={origin} onChange={(e) => setOrigin(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">分類</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">選擇分類</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground resize-y"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>價格與庫存</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">零售價</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">批發價 L1</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={wholesalePriceL1}
                onChange={(e) => setWholesalePriceL1(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">批發價 L2</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={wholesalePriceL2}
                onChange={(e) => setWholesalePriceL2(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">成本價</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">庫存數量</label>
              <Input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">徽章文字（選填）</label>
              <Input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="如: 熱賣" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>商品圖片</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {images.map((url) => (
              <div key={url} className="relative group">
                <Image
                  src={url}
                  alt=""
                  width={96}
                  height={96}
                  className="rounded-lg object-cover border border-border/60"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
              {uploading ? (
                <span className="animate-pulse">上傳中...</span>
              ) : (
                <span>+ 新增</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "儲存中..." : isEdit ? "更新產品" : "新增產品"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
