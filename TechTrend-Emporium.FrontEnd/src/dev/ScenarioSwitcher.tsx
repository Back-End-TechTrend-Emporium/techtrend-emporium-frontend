import Button from "../components/atoms/Button";
import type { UserLike } from "../components/molecules/UserDropdown";

type Props = { setUser: (u: UserLike | null) => void };

export default function ScenarioSwitcher({ setUser }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex gap-2 rounded-xl border border-neutral-200 bg-white/90 p-2 shadow">
      <Button size="sm" onClick={() => { localStorage.clear(); setUser(null); }}>
        Guest
      </Button>
      <Button size="sm" onClick={() => {
        localStorage.setItem("token", "t");
        localStorage.setItem("username", "Jengrik");
        localStorage.setItem("role", "shopper");
        setUser({ id: "c1", name: "Jengrik", role: "shopper" });
      }}>
        Shopper
      </Button>
      <Button size="sm" onClick={() => {
        localStorage.setItem("token", "t");
        localStorage.setItem("username", "Employee");
        localStorage.setItem("role", "employee");
        setUser({ id: "e1", name: "Employee", role: "employee" });
      }}>
        Employee
      </Button>
    </div>
  );
}
