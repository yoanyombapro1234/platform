import React from "react";
import { Story, Meta } from "@storybook/react";
import HeaderWithStackedFlyoutMenu, {
  HeaderWithStackedFlyoutMenuProps,
} from "./header-with-stacked-flyout-menu";

import {
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  ArrowPathIcon,
  PlayCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline"; // Ensure the path is correct

export default {
  title: "Header/HeaderWithStackedFlyoutMenu",
  component: HeaderWithStackedFlyoutMenu,
} as Meta;

const Template: Story<HeaderWithStackedFlyoutMenuProps> = (args) => (
  <HeaderWithStackedFlyoutMenu {...args} />
);

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export const Default = Template.bind({});
Default.args = {
  logoSrc: "https://via.placeholder.com/150",
  headerTitle: "Your Company",
  dropdownTitle: "Products",
  headerOptions: [
    {
      name: "Option 1",
      href: "#",
      icon: ChartPieIcon,
      current: true,
    },
    {
      name: "Option 2",
      href: "#",
      icon: CursorArrowRaysIcon,
      current: true,
    },
  ],
  headerActionButtonTitle: "Get Started",
  headerActionButtonHandler: () => alert("Button Clicked!"),
};

export const NoHeaderOptions = Template.bind({});
NoHeaderOptions.args = {
  ...Default.args,
  headerOptions: [],
};

export const NoCallsToAction = Template.bind({});
NoCallsToAction.args = {
  ...Default.args,
  callsToAction: [],
};

export const NoProducts = Template.bind({});
NoProducts.args = {
  ...Default.args,
  products: [],
};
