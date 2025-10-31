export default function BrandLogo({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Tech Trend Emporium – Home"
      className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-black/20"
    >
      <img
        src="/TTE.png"
        alt="Tech Trend Emporium logo"
        className="h-8 w-8 md:h-10 md:w-10"
      />
      <span className="text-lg font-extrabold tracking-tight md:text-xl">
        Tech Trend Emporium
      </span>
    </button>
  );
}
