import { redirect } from 'next/navigation';

import AssetBrowser from '@/components/files/AssetBrowser';
import { canReadCms, getCurrentUser } from '@/lib/current-user';
import { optionalEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function FilesPage() {
    const currentUser = await getCurrentUser();
    if (!canReadCms(currentUser)) {
        redirect('/not-authorized');
    }

    // 이미지 자산은 운영 nginx가 /deployed/static/*, /static/* 을 서빙한다.
    // 로컬 dev에서는 공유 DB가 가리키는 실제 파일이 CMS_BASE_URL 호스트에만 존재하므로
    // 상대 경로 자산 URL 앞에 이 값을 붙여 원격에서 받아온다. prod는 동일 오리진이라 무해.
    const assetOrigin = optionalEnv('CMS_BASE_URL', '').replace(/\/$/, '');

    return <AssetBrowser assetOrigin={assetOrigin} />;
}
