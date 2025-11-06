
import Button from "../components/atoms/Button";
import { useNavigate } from "react-router-dom";

export default function EmployeePortal() {
  const navigate = useNavigate();

  const cards = [
    { label: "Create Product", to: "/create-product" },
    { label: "Create Category", to: "/create-category" },
    { label: "List Products", to: "/list-products" },
    { label: "List Categories", to: "/list-categories" },
    { label: "Review Jobs", to: "/review-jobs" },
    { label: "Create Employee", to: "/create-employee" },
    { label: "View All Users", to: "/list-users" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-12">
        Employee Portal
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {cards.map((c) => (
          <Button
            key={c.label}
            onClick={() => navigate(c.to)}
            className="border border-gray-800 text-black px-8 py-3 bg-white hover:bg-gray-200"
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
