// src/pages/CreateCategoryPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import { CategoryService } from "../lib/CategoryService";
import type { CategoryDraft } from "../lib/CategoryService";
import { useAuth } from "../auth/AuthContext";

/** Simple validation: only the name is required (min 2 chars) */
const schema = z.object({
  name: z.string().min(2, "Name is required"),
});

type FormData = z.infer<typeof schema>;

export default function CreateCategoryPage() {
  const navigate = useNavigate();

  // feedback messages
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<string | null>(null);

  // Read role/id from central AuthContext
  const { user } = useAuth();
  const rawRole = (user?.role ?? "").toString().toLowerCase();
  const isEmployee = rawRole.includes("employee");
  const isAdmin = rawRole.includes("superadmin") || rawRole.includes("admin");
  const role: "employee" | "admin" | "" = isAdmin ? "admin" : (isEmployee ? "employee" : "");
  const userId = user?.id || "u1";

  /** Guard: only employee/admin is allowed here. Wait until user is known. */
  useEffect(() => {
    if (!user) return;
    if (role !== "employee" && role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [navigate, role, user]);

  // RHF
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  /** Submit */
  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setSubmitOk(null);

    // duplicate guard
    const duplicated = await CategoryService.existsByName(data.name);
    if (duplicated) {
      setSubmitError("A category with this name already exists.");
      return;
    }

    // status by role
    const status: "approved" | "unapproved" = role === "admin" ? "approved" : "unapproved";

    const draft: CategoryDraft = {
      name: data.name.trim(),
      status,
      createdBy: { id: userId, role: role as "employee" | "admin" },
    };

    try {
      await CategoryService.createCategory(draft);
      setSubmitOk(
        role === "admin"
          ? "Category created and approved."
          : "Category created and sent for approval."
      );
      reset();
      // Optionally, go back to the portal:
      // setTimeout(() => navigate("/employee-portal"), 800);
    } catch (err: any) {
      setSubmitError(err?.message || "Could not create the category.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-10">
      <button className="mb-4 text-sm" onClick={() => navigate(-1)}>
        &lt; Back
      </button>

      <h1 className="text-3xl md:text-5xl font-bold text-center mb-10">Employee Portal</h1>

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Create Category</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input label="Name" {...register("name")} error={errors.name?.message} />

          {submitError && <div className="text-red-600 mt-2">{submitError}</div>}
          {submitOk && <div className="text-green-700 mt-2">{submitOk}</div>}

          <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
            {isSubmitting ? "Saving..." : "Add"}
          </Button>
        </form>
      </div>
    </div>
  );
}
