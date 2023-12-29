import React from "react";
import { Story, Meta } from "@storybook/react";

import FinanceStatsCard, {
  FinanceStatsCardProps,
} from "./financial-statistic-card";

export default {
  title: "Card/FinanceStatsCard",
  component: FinanceStatsCard,
} as Meta;

const Template: Story<FinanceStatsCardProps> = (args) => (
  <FinanceStatsCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  stats: [
    {
      name: "Revenue",
      stat: "$405,091.00",
      change: "+4.75%",
      changeType: "increase",
      previousStat: "$405,091.00",
    },
    {
      name: "Overdue invoices",
      stat: "$12,787.00",
      change: "+54.02%",
      changeType: "decrease",
      previousStat: "$405,091.00",
    },
    {
      name: "Outstanding invoices",
      stat: "$245,988.00",
      change: "-1.39%",
      changeType: "increase",
      previousStat: "$405,091.00",
    },
    {
      name: "Expenses",
      stat: "$30,156.00",
      change: "+10.18%",
      changeType: "decrease",
      previousStat: "$405,091.00",
    },
  ],
};
