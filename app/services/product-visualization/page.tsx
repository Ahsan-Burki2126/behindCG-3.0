import ServicePage from '@/components/ServicePage';
import { pageMetadata } from '@/lib/seo';
import { serviceByPath } from '@/lib/services';

export const metadata = pageMetadata('/services/product-visualization');

export default function Page() {
  return <ServicePage s={serviceByPath('/services/product-visualization')} />;
}
