/**
 * @file index.tsx
 * @description 하나카드 사용자 관리 페이지 컴포넌트.
 *
 * 화면 구성:
 *   - 상단바: 뒤로가기 + "사용자관리" 타이틀 + 메뉴 버튼
 *   - 검색 입력 (사용자ID·사용자명) + 사용자 추가 버튼
 *   - 사용자 목록: 사용자ID·사용자명(좌) / PW오류횟수·상태(우)
 *   - 사용자 추가 BottomSheet:
 *       사용자ID·비밀번호·사용자명 Input,
 *       인터넷뱅킹이용자상태코드 Select,
 *       권한 Checkbox(조회·결제·사용자관리),
 *       트랜잭션오류CASE Checkbox, 저장 버튼
 *   - 사용자 수정 BottomSheet:
 *       사용자ID·비밀번호·비밀번호입력오류횟수(readonly)·사용자명 Input,
 *       인터넷뱅킹이용자상태코드 Select,
 *       권한 Checkbox(조회·결제·사용자관리),
 *       트랜잭션오류CASE Checkbox, 수정·삭제 버튼
 *
 * Storybook 확인 목적으로 검색·폼·BottomSheet 상태를 내부 useState로 관리.
 * 실제 앱 구현 시 모든 상태·핸들러는 useUserManagement Hook으로 분리한다.
 *
 * @param onBack        - 뒤로가기 클릭
 * @param onMenuClick   - 헤더 우측 메뉴 클릭
 * @param users         - 사용자 목록
 * @param onAddUser     - 사용자 추가 저장 클릭
 * @param onEditUser    - 사용자 수정 저장 클릭
 * @param onDeleteUser  - 사용자 삭제 확인 클릭
 */
import React, { useState } from 'react';
import { Menu, Search, UserPlus } from 'lucide-react';

import { PageLayout } from '../../../layout/PageLayout';
import { Button } from '../../../core/Button';
import { Input } from '../../../core/Input';
import { Select } from '../../../core/Select';
import { Badge } from '../../../core/Badge';
import { Typography } from '../../../core/Typography';
import { Card } from '../../../modules/common/Card';
import { BottomSheet } from '../../../modules/common/BottomSheet';
import { Checkbox } from '../../../modules/common/Checkbox';
import { Stack } from '../../../layout/Stack';
import { Inline } from '../../../layout/Inline';
import { Section } from '../../../layout/Section';

import type {
  UserManagementPageProps,
  AddUserForm,
  EditUserForm,
  UserItem,
  UserStatusCode,
} from './types';

/** 인터넷뱅킹 이용자 상태 Select 옵션 */
const STATUS_OPTIONS = [
  { value: 'normal', label: '정상' },
  { value: 'terminated', label: '해지' },
];

/** AddUserForm 초기값 */
const EMPTY_ADD_FORM: AddUserForm = {
  userId: '',
  password: '',
  userName: '',
  statusCode: 'normal',
  permInquiry: false,
  permPayment: false,
  permUserMgmt: false,
  txErrorCase: false,
};

/** UserItem → EditUserForm 변환 — 사용자 항목 클릭 시 수정 폼 초기화에 사용 */
function toEditForm(user: UserItem): EditUserForm {
  return {
    userId: user.userId,
    password: '',
    userName: user.userName,
    statusCode: user.status,
    permInquiry: false,
    permPayment: false,
    permUserMgmt: false,
    txErrorCase: false,
    pwErrorCount: user.pwErrorCount,
  };
}

export function UserManagementPage({
  onBack,
  onMenuClick,
  users = [],
  onAddUser,
  onEditUser,
  onDeleteUser,
}: UserManagementPageProps) {
  /** Storybook 확인용 내부 상태 — 실제 앱에서는 useUserManagement Hook에서 관리 */
  const [searchQuery, setSearchQuery] = useState('');

  /* 추가 BottomSheet */
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddUserForm>(EMPTY_ADD_FORM);

  /* 수정 BottomSheet */
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditUserForm>({
    ...EMPTY_ADD_FORM,
    pwErrorCount: 0,
  });

  /** 검색어로 사용자 목록 필터링 (userId 또는 userName 포함 여부) */
  const filteredUsers = searchQuery.trim()
    ? users.filter((u) => u.userId.includes(searchQuery) || u.userName.includes(searchQuery))
    : users;

  /* ── 추가 폼 핸들러 ───────────────────────────────────────── */
  const handleAddFormChange = <K extends keyof AddUserForm>(key: K, value: AddUserForm[K]) =>
    setAddForm((prev) => ({ ...prev, [key]: value }));

  const handleAddSave = () => {
    onAddUser?.(addForm);
    setAddForm(EMPTY_ADD_FORM);
    setAddSheetOpen(false);
  };

  /* ── 수정 폼 핸들러 ───────────────────────────────────────── */
  const handleEditFormChange = <K extends keyof EditUserForm>(key: K, value: EditUserForm[K]) =>
    setEditForm((prev) => ({ ...prev, [key]: value }));

  /** 사용자 항목 클릭 → 수정 폼에 선택된 사용자 정보를 채우고 시트 오픈 */
  const handleUserClick = (user: UserItem) => {
    setEditForm(toEditForm(user));
    setEditSheetOpen(true);
  };

  const handleEditSave = () => {
    onEditUser?.(editForm);
    setEditSheetOpen(false);
  };

  /** 삭제: window.confirm으로 한 번 더 확인 후 onDeleteUser 호출 */
  const handleDelete = () => {
    if (window.confirm('사용자를 삭제하시겠습니까?')) {
      onDeleteUser?.(editForm.userId);
      setEditSheetOpen(false);
    }
  };

  return (
    <div data-brand="hana" data-domain="card">
      <PageLayout
        title="사용자관리"
        onBack={onBack}
        rightAction={
          <Button
            variant="ghost"
            size="md"
            iconOnly
            leftIcon={<Menu className="size-5" />}
            onClick={onMenuClick}
            aria-label="메뉴"
          />
        }
      >
        <Stack gap="md">
          {/* ── 검색 + 사용자 추가 버튼 ─────────────────── */}
          <Section>
            <Inline gap="sm" align="center">
              <Input
                placeholder="사용자ID 또는 사용자명"
                leftIcon={<Search className="size-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
              />
              <Button
                variant="primary"
                size="md"
                leftIcon={<UserPlus className="size-4" />}
                onClick={() => setAddSheetOpen(true)}
              >
                추가
              </Button>
            </Inline>
          </Section>

          {/* ── 사용자 목록 ──────────────────────────────── */}
          <Section>
            <Stack gap="sm" className="px-xs">
              {filteredUsers.map((user) => (
                <Card key={user.id} interactive onClick={() => handleUserClick(user)}>
                  <Inline justify="between" align="center">
                    {/* 좌측: 사용자ID + 사용자명 */}
                    <Stack gap="xs">
                      <Typography variant="body" weight="medium">
                        {user.userId}
                      </Typography>
                      <Typography variant="body-sm" color="secondary">
                        {user.userName}
                      </Typography>
                    </Stack>

                    {/* 우측: PW오류 횟수 + 상태 배지 */}
                    <Stack gap="xs" align="end">
                      <Typography variant="body-sm" color="muted">
                        PW오류 {user.pwErrorCount}회
                      </Typography>
                      <Badge variant={user.status === 'normal' ? 'success' : 'neutral'}>
                        {user.status === 'normal' ? '정상' : '해지'}
                      </Badge>
                    </Stack>
                  </Inline>
                </Card>
              ))}
            </Stack>
          </Section>
        </Stack>
      </PageLayout>

      {/* ── 사용자 추가 BottomSheet ───────────────────────── */}
      <BottomSheet
        open={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        title="사용자 추가"
        snap="full"
        footer={
          <Button variant="primary" fullWidth onClick={handleAddSave}>
            저장
          </Button>
        }
      >
        <Stack gap="lg">
          {/* 기본 정보 입력 — 레이블 좌측 / 컨트롤 우측 */}
          <Stack gap="md" className="px-lg">
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                사용자 ID
              </Typography>
              <Input
                placeholder="사용자 ID를 입력하세요"
                value={addForm.userId}
                onChange={(e) => handleAddFormChange('userId', e.target.value)}
              />
            </Inline>
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                비밀번호
              </Typography>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={addForm.password}
                onChange={(e) => handleAddFormChange('password', e.target.value)}
                validationState={
                  addForm.password.length > 0 && addForm.password.length < 6 ? 'error' : 'default'
                }
                helperText={
                  addForm.password.length > 0 && addForm.password.length < 6
                    ? '비밀번호는 최소 6자 이상이어야 합니다.'
                    : undefined
                }
              />
            </Inline>
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                사용자명
              </Typography>
              <Input
                placeholder="사용자명을 입력하세요"
                value={addForm.userName}
                onChange={(e) => handleAddFormChange('userName', e.target.value)}
              />
            </Inline>
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                인터넷뱅킹이용자상태코드
              </Typography>
              <Select
                options={STATUS_OPTIONS}
                value={addForm.statusCode}
                onChange={(v) => handleAddFormChange('statusCode', v as UserStatusCode)}
                aria-label="인터넷뱅킹이용자상태코드"
              />
            </Inline>
          </Stack>

          {/* 권한 — 레이블 좌측 / 체크박스 3개 우측 한 줄 */}
          <Inline justify="between" align="center" gap="md" className="px-lg">
            <Typography variant="body-sm" color="label">
              권한
            </Typography>
            <Inline gap="lg">
              <Checkbox
                label="조회"
                checked={addForm.permInquiry}
                onChange={(v) => handleAddFormChange('permInquiry', v)}
              />
              <Checkbox
                label="결제"
                checked={addForm.permPayment}
                onChange={(v) => handleAddFormChange('permPayment', v)}
              />
              <Checkbox
                label="사용자관리"
                checked={addForm.permUserMgmt}
                onChange={(v) => handleAddFormChange('permUserMgmt', v)}
              />
            </Inline>
          </Inline>

          {/* 트랜잭션 오류 CASE — 레이블 좌측 / 체크박스 우측 */}
          <Inline justify="between" align="center" gap="md" className="px-lg">
            <Typography variant="body-sm" color="label">
              트랜잭션 오류 CASE
            </Typography>
            <Checkbox
              label="적용"
              checked={addForm.txErrorCase}
              onChange={(v) => handleAddFormChange('txErrorCase', v)}
            />
          </Inline>
        </Stack>
      </BottomSheet>

      {/* ── 사용자 수정 BottomSheet ───────────────────────── */}
      <BottomSheet
        open={editSheetOpen}
        onClose={() => setEditSheetOpen(false)}
        title="사용자 수정"
        snap="full"
        footer={
          <Inline gap="sm">
            <Button variant="primary" fullWidth onClick={handleEditSave}>
              수정
            </Button>
            <Button variant="outline" fullWidth onClick={handleDelete}>
              삭제
            </Button>
          </Inline>
        }
      >
        <Stack gap="lg">
          {/* 기본 정보 입력 — 레이블 좌측 / 컨트롤 우측 */}
          <Stack gap="md" className="px-lg">
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                사용자 ID
              </Typography>
              <Input
                placeholder="사용자 ID를 입력하세요"
                value={editForm.userId}
                onChange={(e) => handleEditFormChange('userId', e.target.value)}
              />
            </Inline>
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                비밀번호
              </Typography>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={editForm.password}
                onChange={(e) => handleEditFormChange('password', e.target.value)}
                validationState={
                  editForm.password.length > 0 && editForm.password.length < 6 ? 'error' : 'default'
                }
                helperText={
                  editForm.password.length > 0 && editForm.password.length < 6
                    ? '비밀번호는 최소 6자 이상이어야 합니다.'
                    : undefined
                }
              />
            </Inline>
            {/* 비밀번호 입력 오류 횟수 — 읽기 전용 텍스트 표시 (서버에서 관리되는 값) */}
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                비밀번호 입력 오류 횟수
              </Typography>
              <Typography variant="body-sm" weight="bold">
                {editForm.pwErrorCount}회
              </Typography>
            </Inline>
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                사용자명
              </Typography>
              <Input
                placeholder="사용자명을 입력하세요"
                value={editForm.userName}
                onChange={(e) => handleEditFormChange('userName', e.target.value)}
              />
            </Inline>
            <Inline justify="between" align="center" gap="md">
              <Typography variant="body-sm" color="label">
                인터넷뱅킹이용자상태코드
              </Typography>
              <Select
                options={STATUS_OPTIONS}
                value={editForm.statusCode}
                onChange={(v) => handleEditFormChange('statusCode', v as UserStatusCode)}
                aria-label="인터넷뱅킹이용자상태코드"
              />
            </Inline>
          </Stack>

          {/* 권한 — 레이블 좌측 / 체크박스 3개 우측 한 줄 */}
          <Inline justify="between" align="center" gap="md" className="px-lg">
            <Typography variant="body-sm" color="label">
              권한
            </Typography>
            <Inline gap="lg">
              <Checkbox
                label="조회"
                checked={editForm.permInquiry}
                onChange={(v) => handleEditFormChange('permInquiry', v)}
              />
              <Checkbox
                label="결제"
                checked={editForm.permPayment}
                onChange={(v) => handleEditFormChange('permPayment', v)}
              />
              <Checkbox
                label="사용자관리"
                checked={editForm.permUserMgmt}
                onChange={(v) => handleEditFormChange('permUserMgmt', v)}
              />
            </Inline>
          </Inline>

          {/* 트랜잭션 오류 CASE — 레이블 좌측 / 체크박스 우측 */}
          <Inline justify="between" align="center" gap="md" className="px-lg">
            <Typography variant="body-sm" color="label">
              트랜잭션 오류 CASE
            </Typography>
            <Checkbox
              label="적용"
              checked={editForm.txErrorCase}
              onChange={(v) => handleEditFormChange('txErrorCase', v)}
            />
          </Inline>
        </Stack>
      </BottomSheet>
    </div>
  );
}
