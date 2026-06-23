"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Category = { id: string; name: string; slug: string; image: string | null };
type Brand = { id: string; name: string; slug: string; code: string };
type Origin = { id: string; name: string; slug: string };

type ProductFormProps = {
  categories: Category[];
  brands: Brand[];
  origins: Origin[];
  product?: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    productCode: string | null;
    isPreOrder: boolean;
    estimatedArrival: string | null;
    sortOrder: number;
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

export function ProductForm({ categories, brands, origins, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [manualSlug, setManualSlug] = useState<string | null>(null);
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [productCode, setProductCode] = useState(product?.productCode ?? "");
  const [origin, setOrigin] = useState(product?.origin ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [retailPrice, setRetailPrice] = useState(product?.retailPrice.toString() ?? "");
  const [wholesalePriceL1, setWholesalePriceL1] = useState(product?.wholesalePriceL1.toString() ?? "");
  const [wholesalePriceL2, setWholesalePriceL2] = useState(product?.wholesalePriceL2.toString() ?? "");
  const [costPrice, setCostPrice] = useState(product?.costPrice.toString() ?? "");
  const [stock, setStock] = useState(product?.stock.toString() ?? "0");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [isPreOrder, setIsPreOrder] = useState(product?.isPreOrder ?? false);
  const [estimatedArrival, setEstimatedArrival] = useState(product?.estimatedArrival ?? "");
  const [sortOrder, setSortOrder] = useState(product?.sortOrder?.toString() ?? "0");
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
      productCode: productCode || null,
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
      isPreOrder,
      estimatedArrival: estimatedArrival || null,
      sortOrder: Number(sortOrder),
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
      <div className="flex gap-8">
        <div className="flex-1 space-y-6">
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
              <select value={brand} onChange={(e) => setBrand(e.target.value)} required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="">選擇品牌</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">產地</label>
              <select value={origin} onChange={(e) => setOrigin(e.target.value)} required
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                <option value="">選擇產地</option>
                {origins.map((o) => (
                  <option key={o.id} value={o.name}>{o.name}</option>
                ))}
              </select>
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
            <label className="text-sm font-medium">產品編號</label>
            <Input
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="e.g. ISH-0001（品牌代號-序號）"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPreOrder} onChange={(e) => setIsPreOrder(e.target.checked)}
                className="h-5 w-5 rounded border-border accent-primary" />
              <span className="text-sm font-medium">📦 預購商品</span>
            </label>
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">預計到港日期</label>
              <Input value={estimatedArrival} onChange={(e) => setEstimatedArrival(e.target.value)}
                placeholder="e.g. 預計 2026年7月中旬到港" />
            </div>
            <div className="w-24 space-y-1.5">
              <label className="text-sm font-medium">排序</label>
              <Input type="number" min="0" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
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

      </div>

      <div className="flex-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>商品圖片</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
              {uploading ? <span className="animate-pulse">上傳中...</span> : <span>+ 點擊上傳圖片</span>}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
            <div className="space-y-2">
              {images.map((url, i) => (
                <div key={url} draggable
                  onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(i)); (e.currentTarget as HTMLElement).style.opacity = "0.4"; }}
                  onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                  onDragLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                    const from = parseInt(e.dataTransfer.getData("text/plain"));
                    const to = i;
                    if (from !== to) {
                      setImages((prev) => {
                        const next = [...prev];
                        const [moved] = next.splice(from, 1);
                        next.splice(to, 0, moved);
                        return next;
                      });
                    }
                  }}
                  className="group relative flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/10 p-2 transition-colors hover:bg-secondary/30 cursor-grab active:cursor-grabbing"
                >
                  <Image src={url} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-md object-cover border border-border/40" />
                  <span className="flex-1 truncate text-xs text-muted-foreground">圖片 {i + 1}</span>
                  <button type="button" onClick={() => removeImage(url)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[10px] text-destructive opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
            </div>
            {images.length === 0 && !uploading && (
              <p className="text-center text-xs text-muted-foreground">尚未上傳圖片</p>
            )}
            {images.length > 0 && (
              <p className="text-xs text-muted-foreground">拖曳圖片可調整排序</p>
            )}
          </CardContent>
        </Card>
      </div>
      </div>

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
