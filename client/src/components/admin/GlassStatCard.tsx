import { MaterialIcon } from "./MaterialIcon";

interface GlassStatCardProps {
  label: string;
  value: number | string;
  icon: string;
  variant?: "blue" | "amber" | "purple" | "green" | "red";
}

const variants = {
  blue: "from-blue-500/20 to-white",
  amber: "from-amber-500/20 to-white",
  purple: "from-purple-500/20 to-white",
  green: "from-green-500/20 to-white",
  red: "from-red-500/20 to-white",
};

const iconColors = {
  blue: "text-primary bg-primary/10",
  amber: "text-amber-600 bg-amber-100",
  purple: "text-purple-600 bg-purple-100",
  green: "text-green-600 bg-green-100",
  red: "text-red-600 bg-red-100",
};

export function GlassStatCard({
  label,
  value,
  icon,
  variant = "blue",
}: GlassStatCardProps) {
  return (
    <div
      className={`glass-card admin-card p-4 bg-gradient-to-br  ${variants[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColors[variant]}`}
        >
          <MaterialIcon name={icon} className="text-xl" />
        </div>
      </div>
    </div>
  );
}
