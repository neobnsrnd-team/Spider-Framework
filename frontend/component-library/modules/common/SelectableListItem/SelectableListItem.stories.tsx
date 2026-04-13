/**
 * @file SelectableListItem.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { SelectableListItem } from './index';

const meta = {
  title: 'Modules/Common/SelectableListItem',
  component: SelectableListItem,
  tags: ['autodocs'],
  args: { label: '2026년 4월', isSelected: false, onClick: () => {} },
} satisfies Meta<typeof SelectableListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { isSelected: true } };
