import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 text-6xl">🔍</span>
      <h1 className="mb-2 font-heading text-2xl font-bold">搵唔到喎</h1>
      <p className="mb-6 text-muted-foreground">
        呢個頁面唔存在，或者已經被移除了。
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        返回首頁
      </Link>
    </div>
  );
}
