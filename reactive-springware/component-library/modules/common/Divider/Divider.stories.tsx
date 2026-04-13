/**
 * @file Divider.stories.tsx
 * @description Divider 컴포넌트 Storybook 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Divider } from './index';
import { Stack } from '../../../layout/Stack';
import { Typography } from '../../../core/Typography';

const meta = {
  title: 'Modules/Common/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 구분선 */
export const Default: Story = {};

/** 섹션 간 구분선 사용 예시 */
export const BetweenSections: Story = {
  render: () => (
    <Stack gap="md">
      <Typography variant="body" color="base">
        첫 번째 섹션 내용
      </Typography>
      <Divider />
      <Typography variant="body" color="base">
        두 번째 섹션 내용
      </Typography>
    </Stack>
  ),
};
