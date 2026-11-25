'use client';

import dynamic from 'next/dynamic';

// GSAP (~55 KB gzipped) loads after the page is interactive, never on the critical path.
const Motion = dynamic(() => import('./Motion'), { ssr: false });

export default function MotionLoader() {
  return <Motion />;
}
