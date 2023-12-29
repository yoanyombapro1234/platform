import React from "react";
import { Story, Meta } from "@storybook/react";

import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import AggregatedStatisticCardWithIcons, {
  AggregatedStatisticCardWithIconsProps,
} from "./brand-icon-aggregated-statistic";

export default {
  title: "Card/AggregatedStatisticWithIcones",
  component: AggregatedStatisticCardWithIcons,
} as Meta;

const Template: Story<AggregatedStatisticCardWithIconsProps> = (args) => (
  <AggregatedStatisticCardWithIcons {...args} />
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
