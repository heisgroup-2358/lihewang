"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 text-6xl">😵</span>
      <h1 className="mb-2 font-heading text-2xl font-bold">唔好意思，發生錯誤</h1>
      <p className="mb-6 text-muted-foreground">
        我哋已經記錄咗呢個問題，請稍後再試。
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        再試一次
      </button>
    </div>
  );
}
