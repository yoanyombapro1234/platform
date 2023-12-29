import React from "react";
import { Story, Meta } from "@storybook/react";
import StackedLayoutOverlap, {
  StackedLayoutOverlapProps,
} from "./stacked-layout-overlap";

export default {
  title: "StackedLayout/StackedLayoutOverlap",
  component: StackedLayoutOverlap,
} as Meta;

const Template: Story<StackedLayoutOverlapProps> = (args) => (
  <StackedLayoutOverlap {...args} />
);

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export const DefaultStackedLayoutOverlap = Template.bind({});
DefaultStackedLayoutOverlap.args = {
  title: "Dashboard",
  user: user,
  navigation: navigation,
  userNavigation: userNavigation,
};

// If you have other variants of the Example component, you can add them in a similar manner to how the PanelLayout variations were added.
