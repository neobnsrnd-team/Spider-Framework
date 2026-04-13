/**
 * @file Input.stories.tsx
 * @description Input 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from './index';

const meta = {
  title: 'Core/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    validationState: { control: 'select', options: ['default', 'error', 'success'] },
    size:            { control: 'select', options: ['md', 'lg'] },
    label:           { control: 'text' },
    helperText:      { control: 'text' },
    placeholder:     { control: 'text' },
    disabled:        { control: 'boolean' },
    fullWidth:       { control: 'boolean' },
  },
  args: {
    label: '계좌번호', placeholder: '계좌번호를 입력하세요',
    validationState: 'default', size: 'md', fullWidth: true,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="기본" placeholder="입력하세요" validationState="default" fullWidth />
      <Input label="성공" placeholder="올바른 형식" validationState="success" helperText="확인되었습니다" fullWidth />
      <Input label="에러" placeholder="오류 발생" validationState="error" helperText="올바른 계좌번호를 입력해주세요" fullWidth />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="검색" placeholder="검색어를 입력하세요" leftIcon={<Search size={16} />} fullWidth />
      <Input
        label="금액"
        placeholder="금액 입력"
        rightElement={<span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>원</span>}
        fullWidth
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, label: '비활성 상태', placeholder: '입력 불가' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

/** 휴대폰번호 포맷 — 자릿수에 따라 010-XXX-XXXX(10자리) / 010-XXXX-XXXX(11자리) 자동 전환 */
export const PhoneNumberFormat: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input
          label="휴대폰번호"
          placeholder="010-0000-0000"
          phoneFormat
          value={value}
          onChange={e => setValue(e.target.value)}
          fullWidth
        />
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
          입력값: {value || '없음'}
        </p>
      </div>
    );
  },
};

/** size prop 비교 — md(기본 높이 48px) vs lg(높이 56px) */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input label="Medium (기본)" placeholder="md 사이즈" size="md" fullWidth />
      <Input label="Large" placeholder="lg 사이즈" size="lg" fullWidth />
    </div>
  ),
};

/** leftIcon + rightElement 동시 사용 — Figma Input/WithIcon Icon=Both에 해당 */
export const WithBothIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Input
        label="검색 + 단위"
        placeholder="금액을 입력하세요"
        leftIcon={<Search size={16} />}
        rightElement={<span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>원</span>}
        fullWidth
      />
      <Input
        label="Large / 검색 + 단위"
        placeholder="금액을 입력하세요"
        size="lg"
        leftIcon={<Search size={16} />}
        rightElement={<span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>원</span>}
        fullWidth
      />
    </div>
  ),
};

/** 은행별 계좌번호 포맷 — 숫자 입력 시 구분자('-')가 자동 삽입된다 */
export const AccountNumberFormat: Story = {
  render: () => {
    const banks = [
      { label: '하나은행',    pattern: '###-######-#####'  },
      { label: 'KB국민은행',  pattern: '######-##-######'  },
      { label: '신한은행',    pattern: '###-###-######'    },
      { label: '우리은행',    pattern: '####-###-######'   },
      { label: 'NH농협은행',  pattern: '###-####-####-##'  },
      { label: 'IBK기업은행', pattern: '###-######-##-###' },
      { label: '카카오뱅크',  pattern: '####-##-#######'   },
      { label: '토스뱅크',    pattern: '####-####-####'    },
    ];
    const [values, setValues] = useState<Record<string, string>>({});
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
        {banks.map(({ label, pattern }) => (
          <Input
            key={label}
            label={label}
            placeholder={pattern.replace(/#/g, '0')}
            formatPattern={pattern}
            value={values[label] ?? ''}
            onChange={e => setValues(prev => ({ ...prev, [label]: e.target.value }))}
            fullWidth
          />
        ))}
      </div>
    );
  },
};