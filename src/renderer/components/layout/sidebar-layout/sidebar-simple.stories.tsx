import { Story, Meta } from "@storybook/react";

import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { SidebarSimple, SidebarSimpleProps } from "./sidebar-simple";

export default {
  title: "SidebarLayout/SidebarSimple",
  component: SidebarSimple,
} as Meta;

const Template: Story<SidebarSimpleProps> = (args) => (
  <SidebarSimple {...args} />
);

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

export const DefaultSidebarSimple = Template.bind({});
DefaultSidebarSimple.args = {
  subNavigation: teams,
  navigation: navigation,
  userNavigation: userNavigation,
};

// If you have other variants of the Example component, you can add them in a similar manner to how the PanelLayout variations were added.
