import { Music2, BookOpen, Gamepad2 } from "lucide-react";

const widgets = [
  {
    label: "SPOTIFY",
    icon: Music2,
    value: "Now Listening: Autechre – Gantz Graf",
  },
  {
    label: "BOOKS",
    icon: BookOpen,
    value: "Currently Reading: Neuromancer",
  },
  {
    label: "STEAM",
    icon: Gamepad2,
    value: "Playing: Elden Ring",
  },
];

export function ActivityWidgets() {
  return (
    <section className="grid grid-cols-3 gap-6 py-8 border-t border-b border-border">
      {widgets.map(({ label, icon: Icon, value }) => (
        <div key={label}>
          <p className="text-[9px] tracking-[0.2em] text-muted-foreground mb-2 uppercase">
            {label}
          </p>
          <div className="flex items-start gap-2">
            <Icon className="size-3.5 mt-0.5 text-muted-foreground shrink-0" />
            <span className="text-xs leading-4 text-foreground">{value}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
