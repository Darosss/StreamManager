interface StatusLabelProps {
  enabled: boolean;
  children: string;
}

export function StatusLabel({ enabled, children }: StatusLabelProps) {
  return (
    <div className={`${enabled ? "enabled" : "disabled"}`}>{children}</div>
  );
}
