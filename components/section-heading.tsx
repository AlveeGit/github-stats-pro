export function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10">
      <div className="inline-flex items-center justify-center size-10 rounded-lg bg-blue-500/10 text-blue-400 mb-4">
        <Icon className="size-5" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-slate-400 text-sm sm:text-base">{subtitle}</p>
    </div>
  );
}
