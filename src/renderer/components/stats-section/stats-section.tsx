import { Card } from "../ui/card";

export type Stat = {
  id: number;
  name: string;
  value: string;
};

// const stats: Stat[] = [
//   { id: 1, name: "Transactions every 24 hours", value: "44 million" },
//   { id: 2, name: "Assets under holding", value: "$119 trillion" },
//   { id: 3, name: "New users annually", value: "46,000" },
// ];

interface StatsSectionProps {
  theme?: "light" | "dark";
  stats?: Stat[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  theme = "light",
  stats = [],
}) => {
  const bgColorClass = theme === "light" ? "bg-white" : "bg-black";
  const textBaseColor = theme === "light" ? "text-gray-600" : "text-gray-400";
  const textValueColor = theme === "light" ? "text-gray-900" : "text-white";

  return (
    <Card className={`${bgColorClass} py-24 sm:py-32`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className={`text-base leading-7 ${textBaseColor}`}>
                {stat.name}
              </dt>
              <dd
                className={`order-first text-3xl font-semibold tracking-tight ${textValueColor} sm:text-5xl`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
};

export default StatsSection;
