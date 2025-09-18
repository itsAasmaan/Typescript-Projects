import React from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "number";
  onEnter?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  type = "text",
  onEnter,
  onFocus,
  onBlur,
  className = "",
  autoComplete,
  leftIcon,
  rightIcon,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  const baseInputClasses = "w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed";

  const inputClasses = error
    ? `${baseInputClasses} border-red-300 focus:ring-red-500`
    : `${baseInputClasses} border-gray-300`;

  const containerClasses = leftIcon || rightIcon ? "relative" : "";
  const inputPaddingClasses = `${leftIcon ? "pl-10" : ""} ${
    rightIcon ? "pr-10" : ""
  }`;

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className={containerClasses}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{leftIcon}</div>
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onKeyPress={handleKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          className={`${inputClasses} ${inputPaddingClasses}`}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="text-gray-400">{rightIcon}</div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
