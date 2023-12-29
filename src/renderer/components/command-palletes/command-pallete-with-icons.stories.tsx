// CommandPalleteWithIcons.stories.tsx
import React from "react";
import { Meta, Story } from "@storybook/react";

import {
  DocumentPlusIcon,
  FolderIcon,
  FolderPlusIcon,
  HashtagIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  CommandPalleteQuickAction,
  CommandPalleteWithIcons,
} from "./command-pallete-with-icons";
import { Transaction, TransactionClass } from "@solomon-ai/component-library";

export default {
  title: "CommandPalletes/CommandPalleteWithIcons",
  component: CommandPalleteWithIcons,
} as Meta;

const Template: Story<{
  transactions: Transaction[];
  quickActions: CommandPalleteQuickAction[];
}> = (args) => <CommandPalleteWithIcons {...args} />;

const transactions: Transaction[] = Array.from(
  { length: 50 },
  () => TransactionClass.randomInstance() as Transaction,
).sort((a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime());
const quickActions: CommandPalleteQuickAction[] = [
  {
    name: "Add new file...",
    icon: DocumentPlusIcon,
    shortcut: "N",
    callback: () => console.log("Add new file clicked"),
  },
  {
    name: "Add new folder...",
    icon: FolderPlusIcon,
    shortcut: "F",
    callback: () => console.log("Add new file clicked"),
  },
  {
    name: "Add hashtag...",
    icon: HashtagIcon,
    shortcut: "H",
    callback: () => console.log("Add new file clicked"),
  },
  {
    name: "Add label...",
    icon: TagIcon,
    shortcut: "L",
    callback: () => console.log("Add new file clicked"),
  },
];
export const Default = Template.bind({});
Default.args = {
  transactions: transactions,
  quickActions: [
    {
      name: "Quick Action 1",
      shortcut: "A",
      icon: FolderIcon,
      callback: () => console.log("Quick Action 1 clicked"),
    },
    {
      name: "Quick Action 2",
      shortcut: "B",
      icon: UsersIcon,
      callback: () => console.log("Quick Action 2 clicked"),
    },
    // ... add more quick actions for demonstration purposes
  ],
};
