/** Reusable page-section header with left accent border. */
export function PageSection({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1F2661] border-l-4 border-[#ff4676] pl-4 mb-2">
        {title}
      </h2>
      {description && (
        <p className="text-[#5a6879] text-sm sm:text-base ml-5">
          {description}
        </p>
      )}
    </div>
  );
}
