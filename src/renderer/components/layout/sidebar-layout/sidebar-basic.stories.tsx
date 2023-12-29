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
import { SidebarBasic, SidebarBasicProps } from "./sidebar-basic";

export default {
  title: "SidebarLayout/SidebarBasic",
  component: SidebarSimple,
} as Meta;

const Template: Story<SidebarBasicProps> = (args) => <SidebarBasic {...args} />;

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

export const DefaultSidebarBasic = Template.bind({});
DefaultSidebarBasic.args = {
  navigationItems: navigation,
  userName: "John Doe",
  userProfileImage: "http://placekitten.com/200/200",
};

// If you have other variants of the Example component, you can add them in a similar manner to how the PanelLayout variations were added.
