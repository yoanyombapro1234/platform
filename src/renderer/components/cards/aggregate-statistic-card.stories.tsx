import React from "react";
import { Story, Meta } from "@storybook/react";
import AggregatedStatisticCard, {
  AggregatedStatisticCardProps,
} from "./aggregate-statistic-card";

export default {
  title: "Card/Aggregated Statistic",
  component: AggregatedStatisticCard,
} as Meta;

const Template: Story<AggregatedStatisticCardProps> = (args) => (
  <AggregatedStatisticCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  stats: [
    {
      name: "Total Subscribers",
      stat: "71,897",
      previousStat: "70,946",
      change: "12%",
      changeType: "increase",
    },
    {
      name: "Avg. Open Rate",
      stat: "58.16%",
      previousStat: "56.14%",
      change: "2.02%",
      changeType: "increase",
    },
    {
      name: "Avg. Click Rate",
      stat: "24.57%",
      previousStat: "28.62%",
      change: "4.05%",
      changeType: "decrease",
    },
  ],
};
