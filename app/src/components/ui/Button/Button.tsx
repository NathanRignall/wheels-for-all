import clsx from "clsx";

export type ButtonProps = {
  id?: string;
  className?: string;
  variant?: "primary" | "secondary" | "success" | "danger";
  display?: "inline" | "block";
  size?: "sm" | "md" | "lg";
  onClick?: (() => void) | ((event: any) => any);
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
};

export const Button = ({
  id,
  className,
  variant = "primary",
  display = "inline",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  active = false,
  children,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={clsx(
        className,

        display == "inline",
        display == "block" && "w-full",
        size === "sm" && "text-xs px-3 py-2",
        size === "md" && "text-sm px-5 py-3",
        size === "lg" && "text-lg px-6 py-4",
        disabled && "cursor-not-allowed opacity-50",
        variant === "primary" && "text-white bg-blue-600 border-blue-800 hover:bg-blue-500 hover:border-blue-700 dark:text-white dark:bg-blue-700 dark:border-blue-500 dark:hover:bg-blue-600 dark:hover:border-blue-700",
        variant === "success" && "text-white bg-green-600 border-green-800 hover:bg-green-500 hover:border-green-700 dark:text-white dark:bg-green-700 dark:border-green-500 dark:hover:bg-green-600 dark:hover:border-green-700",
        variant === "danger" && "text-white bg-red-600 border-red-800 hover:bg-red-500 hover:border-red-700 dark:text-white dark:bg-red-700 dark:border-red-500 dark:hover:bg-red-600 dark:hover:border-red-700",
        "font-medium rounded-lg border-2"
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
