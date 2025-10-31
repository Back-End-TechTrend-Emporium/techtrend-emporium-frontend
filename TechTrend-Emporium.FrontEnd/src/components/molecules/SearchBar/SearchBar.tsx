import { useId, useState } from "react";
import Input from "../../atoms/Input";
import Icon from "../../atoms/Icon";
import Button from "../../atoms/Button";

export default function SearchBar({
  onSearch,
  placeholder = "Search",
}: {
  onSearch?: (q: string) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const id = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
  };

  return (
    <form onSubmit={submit} className="w-full">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>

      <Input
        id={id}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Icon name="search" className="h-5 w-5" />}
        rightSlot={
          <Button type="submit" variant="ghost" size="sm" className="rounded-full px-3">
            Search
          </Button>
        }
      />
    </form>
  );
}
