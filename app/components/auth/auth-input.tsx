import { cn } from "@/lib/utils";

type AuthInputProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength,
  error,
  disabled,
  readOnly,
}: AuthInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "w-full rounded-2xl border bg-input-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-primary/25",
          error ? "border-red-500" : "border-border",
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <p id={`${name}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </label>
  );
}
