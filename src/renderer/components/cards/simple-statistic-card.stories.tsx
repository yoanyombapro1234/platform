import React from "react";
import { Story, Meta } from "@storybook/react";

import SimpletStatisticCard, {
  SimpletStatisticCardProps,
} from "./simple-statistic-card";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default {
  title: "Card/SimpletStatisticCard",
  component: SimpletStatisticCard,
} as Meta;

const Template: Story<SimpletStatisticCardProps> = (args) => (
  <SimpletStatisticCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  stats: [
    {
      name: "Total Subscribers",
      stat: "71,897",
      icon: UsersIcon,
      change: "122",
      changeType: "increase",
      previousStat: "",
    },
    {
      name: "Avg. Open Rate",
      stat: "58.16%",
      icon: EnvelopeOpenIcon,
      change: "5.4%",
      changeType: "increase",
      previousStat: "",
    },
    {
      name: "Avg. Click Rate",
      stat: "24.57%",
      icon: CursorArrowRaysIcon,
      change: "3.2%",
      changeType: "decrease",
      previousStat: "",
    },
  ],
};
