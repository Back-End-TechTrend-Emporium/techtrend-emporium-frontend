import { useId, useState, useEffect } from "react";
import Input from "../../atoms/Input";
import Icon from "../../atoms/Icon";
import Button from "../../atoms/Button";
import { useDebounce } from "../../../hooks/useDebounce";
import Spinner from "../../atoms/Spinner/Spinner";

export default function SearchBar({
  onSearch,
  onChangeDebounced,
  placeholder = "Search",
  isLoading = false,
}: {
  onSearch?: (q: string) => void;
  onChangeDebounced?: (q: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}) {
  const [q, setQ] = useState("");
  const id = useId();
  const debounced = useDebounce(q, 350);

  useEffect(() => {
    const trimmed = debounced.trim();
    onChangeDebounced?.(trimmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

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
          <div className="flex items-center gap-2">
            {isLoading ? <Spinner size={18} /> : null}
            <Button type="submit" variant="ghost" size="sm" className="rounded-full px-3">
              Search
            </Button>
          </div>
        }
      />
    </form>
  );
}
