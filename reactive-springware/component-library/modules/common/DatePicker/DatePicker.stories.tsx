/**
 * @file DatePicker.stories.tsx
 * @description DatePicker 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DatePicker } from './index';

const meta = {
  title: 'Modules/Common/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    mode:     { control: 'select', options: ['single', 'range'] },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
  args: { mode: 'single', label: '조회 날짜', placeholder: '날짜를 선택하세요' },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleDate: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | null>(null);
    return <DatePicker {...args} value={value} onChange={setValue} />;
  },
};

export const RangePicker: Story = {
  args: { mode: 'range', label: '조회 기간' },
  render: (args) => {
    const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
    return <DatePicker {...args} rangeValue={range} onRangeChange={setRange} />;
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: '비활성 날짜 선택' },
  render: (args) => <DatePicker {...args} value={new Date()} />,
};

export const WithConstraints: Story = {
  args: { label: '이번달 조회 (범위 제한)' },
  render: (args) => {
    const now = new Date();
    const [value, setValue] = useState<Date | null>(null);
    return (
      <DatePicker
        {...args}
        value={value}
        onChange={setValue}
        minDate={new Date(now.getFullYear(), now.getMonth(), 1)}
        maxDate={new Date(now.getFullYear(), now.getMonth() + 1, 0)}
      />
    );
  },
};