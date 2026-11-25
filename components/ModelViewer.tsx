'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

// Click-to-load 3D viewer. Nothing 3D is downloaded until the visitor asks for it:
// the poster (a normal render) shows first, then model-viewer (~1 MB of script) and the
// .glb load on click, with a progress bar. Supports orbit, zoom and AR on phones.
type Status = 'idle' | 'loading' | 'ready' | 'error';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}

export default function ModelViewer({
  src,
  alt,
  sizeMb,
  poster,
}: {
  src: string;
  alt: string;
  sizeMb?: number;
  poster: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLElement>(null);

  async function load() {
    setStatus('loading');
    try {
      const mod = await import('@google/model-viewer');
      // Decode Draco-compressed meshes from this site, not Google's CDN.
      (mod.ModelViewerElement as unknown as { dracoDecoderLocation: string }).dracoDecoderLocation = '/decoders/draco/';
    } catch {
      setStatus('error');
    }
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onProgress = (e: Event) => setProgress((e as CustomEvent<{ totalProgress: number }>).detail.totalProgress);
    const onLoad = () => setStatus('ready');
    const onError = () => setStatus('error');
    el.addEventListener('progress', onProgress);
    el.addEventListener('load', onLoad);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('progress', onProgress);
      el.removeEventListener('load', onLoad);
      el.removeEventListener('error', onError);
    };
  }, [status === 'idle']);

  return (
    <div className={`mv mv-${status}`}>
      {/* The poster stays in the flow so the frame keeps its size; it fades out once the model is ready. */}
      <div className="mv-poster" aria-hidden={status === 'ready' ? true : undefined}>{poster}</div>

      {status !== 'idle' && status !== 'error' && (
        <model-viewer
          ref={ref}
          src={src}
          alt={alt}
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="1200"
          rotation-per-second="18deg"
          interaction-prompt="auto"
          touch-action="pan-y"
          shadow-intensity="1"
          shadow-softness="0.8"
          exposure="1.05"
          environment-image="neutral"
          tone-mapping="aces"
          ar=""
          ar-modes="webxr scene-viewer quick-look"
          className="mv-el"
        >
          <button slot="ar-button" className="btn btn-secondary mv-ar" type="button">
            <Icon name="cube" />View in your room
          </button>
        </model-viewer>
      )}

      {status === 'idle' && (
        <button type="button" className="mv-start" onClick={load}>
          <span className="mv-start-ic"><Icon name="cube" /></span>
          <span className="stack" style={{ gap: 2, alignItems: 'flex-start' }}>
            <span className="mv-start-t">View in 3D</span>
            <span className="mv-start-s">Drag to rotate{sizeMb ? ` · ${sizeMb.toFixed(1)} MB` : ''}</span>
          </span>
        </button>
      )}

      {status === 'loading' && (
        <div className="mv-progress" role="progressbar" aria-label="Loading 3D model" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      )}

      {status === 'error' && (
        <p className="mv-msg" role="alert">The 3D model could not load. The render above shows the product.</p>
      )}
    </div>
  );
}
