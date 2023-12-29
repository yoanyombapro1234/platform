import React, { useCallback, useState } from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Sector,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { cn } from "src/lib/utils";

/**
 * Interface for the data items
 */
interface DataItem {}

/**
 * Props for the CategoryMonthlyIncomeCard component
 * @template T - Type of the data items
 * @property data - Data array
 * @property xAxisDataKey - Key of the X axis data in data objects
 * @property yAxisDataKey - Key of the Y axis data in data objects
 * @property title - Title of the card
 */
interface CategoryMonthlyIncomeCardProps<T> {
  data: T[];
  xAxisDataKey: string;
  yAxisDataKey: string;
  title: string;
  className?: string;
}

/**
 * A bar chart component that is responsive and shows data on a bar chart
 * @template T - Type of the data items which extends DataItem
 * @param props - Props for the component
 * @returns ReactElement
 */
const CardinalAreaChart = <T extends DataItem>({
  data,
  xAxisDataKey,
  yAxisDataKey,
  title,
  className,
}: CategoryMonthlyIncomeCardProps<T>): React.ReactElement => {
  return (
    <Card className={cn("py-3", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey={xAxisDataKey}
              stroke="#fffff"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#fffff"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey={yAxisDataKey} fill="#fffff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

/**
 * Props for the CardinalPieChartProps component
 * @template T - Type of the data items
 * @property data - Data array
 * @property yAxisDataKey - Key of the Y axis data in data objects
 * @property title - Title of the card
 */
interface CardinalPieChartProps<T> {
  data: T[];
  yAxisDataKey: string;
  title: string;
  className?: string;
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

/**
 * A pie chart component that is responsive and shows data on a pie chart
 * @template T - Type of the data items which extends DataItem
 * @param props - Props for the component
 * @returns ReactElement
 */
const CardinalPieChart = <T extends DataItem>({
  data,
  yAxisDataKey,
  title,
  className,
}: CardinalPieChartProps<T>): React.ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_: any, index: React.SetStateAction<number>) => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  return (
    <Card className={cn("py-3", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <PieChart width={800} height={800}>
          <Pie
            dataKey={yAxisDataKey}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export { CardinalAreaChart, CardinalPieChart };
