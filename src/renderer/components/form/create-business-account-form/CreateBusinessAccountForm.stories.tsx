import { Story, Meta } from "@storybook/react";

import { MultiStepCreateBusinessAccountForm } from "./CreateBusinessAccountForm";
import { CreateAccountV2RequestClass } from "@solomon-ai/component-library";

export default {
  title: "Forms/Onboarding/CreateBusinessAccount",
  component: MultiStepCreateBusinessAccountForm,
} as Meta;

const Template: Story = (args) => (
  <MultiStepCreateBusinessAccountForm
    callback={function (data: CreateAccountV2RequestClass): void {
      console.log(data);
    }}
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {};
