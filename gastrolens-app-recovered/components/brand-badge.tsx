import Image from "next/image";

type BrandBadgeProps = {
  title?: string;
  subtitle?: string;
};

export function BrandBadge({
  title = "Gastro Compass",
  subtitle = "Digestive health insights",
}: BrandBadgeProps) {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.92),rgba(255,255,255,0.12))] shadow-[0_0_0_6px_rgba(105,213,210,0.14)]">
        <Image src="/logo.svg" alt="Gastro Compass logo" width={42} height={42} className="h-full w-full" />
      </div>
      <div>
        <p className="font-heading text-base font-extrabold text-ink">{title}</p>
        <p className="text-sm font-medium text-muted">{subtitle}</p>
      </div>
    </div>
  );
}
