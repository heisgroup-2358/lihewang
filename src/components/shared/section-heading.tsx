import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  children,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        className,
      )}
    >
      <h2 className="font-heading text-2xl font-bold tracking-wide sm:text-3xl">
        {children}
      </h2>
      <div className="mx-auto mt-3 h-0.5 w-12 bg-primary" />
    </div>
  );
}
