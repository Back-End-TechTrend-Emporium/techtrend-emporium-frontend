import Icon from "../../atoms/Icon";
import Badge from "../../atoms/Badge";
export default function ActionIcon({
  name,
  onClick,
  count,
  ariaLabel,
}: {
  name: "search" | "heart" | "cart" | "user";
  onClick?: () => void;
  count?: number;
  ariaLabel: string; // <- aquí con la L mayúscula
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="relative rounded-full p-2 hover:bg-neutral-100 focus:outline-none focus:ring-2"
      onClick={onClick}
    >
      <Icon name={name} className="h-5 w-5" />
      {!!count && <Badge count={count} label={`${name} items`} />}
    </button>
  );
}
