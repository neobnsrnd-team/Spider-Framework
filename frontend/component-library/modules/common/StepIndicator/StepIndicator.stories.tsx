/**
 * @file StepIndicator.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { StepIndicator } from './index';

const meta = {
  title: 'Modules/Common/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  args: { total: 4, current: 1 },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = { args: { current: 1 } };
export const Step2: Story = { args: { current: 2 } };
export const Step3: Story = { args: { current: 3 } };
export const Step4: Story = { args: { current: 4 } };
