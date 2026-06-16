interface BadgeProps {
  label: string;
  variant?: "default" | "orange";
}

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${
        variant === "orange"
          ? "bg-orange/10 border-orange/30 text-orange"
          : "bg-surface border-border text-muted"
      }`}
    >
      {label}
    </span>
  );
}
