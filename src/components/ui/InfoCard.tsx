/** Reusable info-card used across content pages (shipping options, payment methods, etc.) */
export function InfoCard({
  icon,
  title,
  badge,
  badgeVariant = "green",
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  badge?: string;
  badgeVariant?: "green" | "pink" | "default";
  children: React.ReactNode;
}) {
  const badgeColors: Record<string, string> = {
    green: "bg-[#e8f8e5] text-[#7FF46A]",
    pink: "bg-[#ffe8ec] text-[#ff4676]",
    default: "bg-[#eef2f5] text-[#5a6879]",
  };

  return (
    <div className="rounded-3xl border border-[#eef2f5] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-[#7FF46A] hover:shadow-md">
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2661] text-white text-xl">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[#1F2661] mb-1">{title}</h3>
      {badge && (
        <span
          className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold mb-2 ${
            badgeColors[badgeVariant]
          }`}
        >
          {badge}
        </span>
      )}
      <div className="text-sm text-[#5a6879] leading-relaxed">{children}</div>
    </div>
  );
}
