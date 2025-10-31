export function CurrencyRail({
  currency = "USD",
  onSelectCurrency,
}: {
  currency?: string;
  onSelectCurrency?: () => void;
}) {
  return (
    <div className="w-full bg-neutral-900 text-neutral-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 text-xs sm:text-[13px]">
        <button
          type="button"
          aria-label="Change currency"
          onClick={onSelectCurrency}
          className="inline-flex items-center gap-1 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {currency}
        </button>
        <div className="hidden gap-4 sm:flex opacity-80">
          <a href="#shipping" className="hover:opacity-100">
            Shipping
          </a>
          <a href="#support" className="hover:opacity-100">
            Support
          </a>
          <a href="#stores" className="hover:opacity-100">
            Stores
          </a>
        </div>
      </div>
    </div>
  );
}

export function ShippingBanner() {
  return (
    <div className="w-full bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-xs sm:text-sm">
        FREE SHIPPING ON ALL HERMAN MILLER! FEB. 25–28.
      </div>
    </div>
  );
}
