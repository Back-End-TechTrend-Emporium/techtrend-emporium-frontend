import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../auth/AuthContext";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
      message: "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol",
    }),
});

type RegisterForm = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterForm) => {
    await registerUser(data.email, data.username, data.password);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow" role="main">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message as string | undefined}
        />

        <Input
          label="Username"
          type="text"
          {...register("username")}
          error={errors.username?.message as string | undefined}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={errors.password?.message as string | undefined}
          rightSlot={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="text-sm px-2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          }
        />

        {error && <div className="text-red-600 mt-2" role="alert">{error}</div>}

        <Button type="submit" disabled={isLoading} className="mt-4 w-full">
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
