import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2.5 py-1.5 text-sm rounded-md",
  md: "px-3 py-2 text-sm rounded-lg",
  lg: "px-4 py-2 text-base rounded-xl",
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-2 focus:ring-black/20",
  ghost: "hover:bg-neutral-100 focus:ring-2 focus:ring-black/20",
  link: "underline underline-offset-2 hover:opacity-80",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}
