import React from "react";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "success";

interface ButtonProps {
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string | { overrideAll?: true; value: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  asLink?: boolean;
  props?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
}
const getButtonClassNames = (variant: ButtonVariant = "primary") => {
  switch (variant) {
    case "secondary":
      return "secondary-button";
    case "tertiary":
      return "tertiary-button";
    case "danger":
      return "danger-button";
    case "success":
      return "success-button";

    default:
      return "primary-button";
  }
};

export function Button({
  variant,
  className,
  disabled,
  onClick,
  children,
  props,
}: ButtonProps) {
  const variantClass = getButtonClassNames(variant);
  const classNameValue =
    typeof className === "string" || className === undefined
      ? `common-button ${variantClass} ${className}`
      : className?.value;
  return (
    <button
      className={`${classNameValue || ""}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <div>{children}</div>
    </button>
  );
}
