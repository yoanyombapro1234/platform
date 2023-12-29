import React from "react";
import { Story, Meta } from "@storybook/react";
import {
  DashboardSidebar,
  DashboardSidebarProps,
} from "./business-portal-sidebar";

import { HomeIcon } from "@heroicons/react/24/outline";

export default {
  title: "Sidebar/DashboardSidebar",
  component: DashboardSidebar,
} as Meta;

const Template: Story<DashboardSidebarProps> = (args) => (
  <DashboardSidebar {...args} />
);

export const Default = Template.bind({});
Default.args = {
  navigation: [
    { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    // ... (other navigation items)
  ],
  teams: [
    { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
    // ... (other teams)
  ],
  userNavigation: [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#" },
  ],
};
