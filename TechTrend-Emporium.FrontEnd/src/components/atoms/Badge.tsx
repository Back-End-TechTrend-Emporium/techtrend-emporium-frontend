export default function Badge({
  count = 0,
  label,
}: {
  count?: number;
  label?: string;
}) {
  if (!count) return null;
  return (
    <span
      aria-label={label}
      className="absolute -right-1 -top-1 min-w-[1.125rem] rounded-full border border-white bg-rose-600 px-1 text-center text-[0.65rem] font-semibold leading-4 text-white shadow"
    >
      {count}
    </span>
  );
}
