'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

// Films load nothing until the visitor presses play: the poster is a normal image slot,
// then the YouTube (privacy-enhanced domain) or Vimeo player, or a self-hosted file,
// replaces it. `loop` mode is for short muted clips: they play only while on screen.
export type Video =
  | { provider: 'youtube'; id: string }
  | { provider: 'vimeo'; id: string }
  | { provider: 'file'; src: string }
  | { provider: 'none' };

export default function VideoPlayer({
  video,
  title,
  duration,
  poster,
  loop = false,
}: {
  video: Video;
  title: string;
  duration?: string;
  poster: React.ReactNode;
  loop?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);

  // Muted loops: play while at least 30% visible, pause otherwise; never on reduced motion.
  useEffect(() => {
    const el = loopRef.current;
    if (!loop || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [loop]);

  if (loop && video.provider === 'file') {
    return (
      <div className="vp vp-loop">
        <video ref={loopRef} src={video.src} muted loop playsInline preload="none" aria-label={title} className="vp-media" />
      </div>
    );
  }

  const available = video.provider !== 'none';

  if (playing && available) {
    return (
      <div className="vp vp-on">
        {video.provider === 'youtube' && (
          <iframe
            className="vp-media"
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
        {video.provider === 'vimeo' && (
          <iframe
            className="vp-media"
            src={`https://player.vimeo.com/video/${encodeURIComponent(video.id)}?autoplay=1&dnt=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
        {video.provider === 'file' && <video className="vp-media" src={video.src} controls autoPlay playsInline aria-label={title} />}
      </div>
    );
  }

  return (
    <div className="vp">
      {poster}
      <button
        type="button"
        className="vp-play"
        onClick={() => setPlaying(true)}
        disabled={!available}
        aria-label={available ? `Play ${title}` : `${title}: film coming soon`}
      >
        <span className="play-lg" aria-hidden="true"><Icon name="play" /></span>
        {!available && <span className="vp-soon">Film coming soon</span>}
      </button>
      {duration && <span className="dur">{duration}</span>}
    </div>
  );
}
