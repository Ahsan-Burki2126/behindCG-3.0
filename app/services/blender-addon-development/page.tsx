import ServicePage from '@/components/ServicePage';
import { pageMetadata } from '@/lib/seo';
import { serviceByPath } from '@/lib/services';

export const metadata = pageMetadata('/services/blender-addon-development');

export default function Page() {
  return <ServicePage s={serviceByPath('/services/blender-addon-development')} />;
}
