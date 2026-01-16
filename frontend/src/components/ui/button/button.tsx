import React from "react";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "success";

type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  variant?: ButtonVariant;
  disabled?: boolean;
  size?: ButtonSize;
  className?: string | { overrideAll?: true; value: string };
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  asLink?: boolean;
  props?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
}
const getButtonClassNames = (variant: ButtonVariant) => {
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

const getButtonSizeNames = (size: ButtonSize) => {
  switch (size) {
    case "medium":
      return "medium-button";
    case "large":
      return "large-button";

    default:
      return "small-button";
  }
};

export function Button({
  variant = "primary",
  className,
  disabled,
  size = "medium",
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
      className={`${classNameValue || ""} ${getButtonSizeNames(size)}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <div>{children}</div>
    </button>
  );
}
