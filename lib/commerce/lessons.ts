import 'server-only';
import type { Video } from '@/components/VideoPlayer';

// Lesson videos, read on the server only after access is checked, so the IDs never reach
// visitors without access. Use Vimeo with "Hide from Vimeo" + domain-level privacy (embed only
// on your domain) or Bunny Stream with token auth, so links can't be shared and played elsewhere.
//
// Key: "<course-slug>/<module number>-<lesson number>", counting from 1.
const LESSON_VIDEOS: Record<string, Video> = {
  // 'product-visualization-masterclass/1-1': { provider: 'vimeo', id: '123456789' },
};

export const lessonVideo = (slug: string, module: number, lesson: number): Video =>
  LESSON_VIDEOS[`${slug}/${module}-${lesson}`] ?? { provider: 'none' };
