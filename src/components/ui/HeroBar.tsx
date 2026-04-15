/** Reusable hero bar for info pages (FAQ, Shipping, Payment, etc.) */
export function HeroBar({
  title,
  description,
  accent,
}: {
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <div className="rounded-3xl bg-[#1F2661] px-6 py-8 text-center mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        {title}
      </h1>
      <p className="text-white/85 text-sm sm:text-base">{description}</p>
      {accent && (
        <span className="mt-3 inline-block rounded-full bg-[#7FF46A] px-4 py-1 text-xs font-bold text-[#1F2661]">
          {accent}
        </span>
      )}
    </div>
  );
}
