'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

// Filterable grid with a lightbox. Items with their own page (href) link there; the rest
// open full size in a native <dialog> (focus stays inside, Esc closes) with previous/next.
export type GalleryItem = {
  key: string;
  category: string;
  title: string;
  card: React.ReactNode;
  full?: React.ReactNode; // large image for the lightbox; omit when the card links to a page
};

export default function Gallery({ label, categories, items }: { label: string; categories: string[]; items: GalleryItem[] }) {
  const [on, setOn] = useState('All');
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = on === 'All' ? items : items.filter((i) => i.category === on);
  const zoomable = shown.filter((i) => i.full);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) {
      d.showModal();
      d.querySelector<HTMLButtonElement>('[aria-label="Close"]')?.focus();
    }
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % zoomable.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + zoomable.length) % zoomable.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, zoomable.length]);

  const current = open !== null ? zoomable[open] : null;

  return (
    <>
      <div className="tabs" role="group" aria-label={label} style={{ marginBottom: 40 }}>
        {['All', ...categories].map((c) => (
          <button key={c} type="button" className={`tag${on === c ? ' is-on' : ''}`} aria-pressed={on === c} onClick={() => setOn(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{`${shown.length} ${shown.length === 1 ? 'item' : 'items'} shown`}</p>
      <div className="masonry">
        {shown.map((i) => (
          <div key={i.key}>
            {i.full ? (
              <button type="button" className="lb-open" onClick={() => setOpen(zoomable.indexOf(i))} aria-label={`View ${i.title} full size`}>
                {i.card}
              </button>
            ) : (
              i.card
            )}
          </div>
        ))}
      </div>

      <dialog ref={dialog} className="lb" aria-label={current ? current.title : 'Image viewer'} onClose={() => setOpen(null)} onClick={(e) => e.target === dialog.current && setOpen(null)}>
        {current && (
          <div className="lb-body">
            <div className="lb-media">{current.full}</div>
            <div className="lb-bar">
              <div className="stack" style={{ gap: 4 }}>
                <span className="cat">{current.category}</span>
                <span className="h4">{current.title}</span>
              </div>
              <div className="lb-nav">
                {zoomable.length > 1 && (
                  <>
                    <button type="button" className="lb-btn lb-prev" aria-label="Previous image" onClick={() => setOpen((open! - 1 + zoomable.length) % zoomable.length)}>
                      <Icon name="arrow" />
                    </button>
                    <button type="button" className="lb-btn" aria-label="Next image" onClick={() => setOpen((open! + 1) % zoomable.length)}>
                      <Icon name="arrow" />
                    </button>
                  </>
                )}
                <button type="button" className="lb-btn" aria-label="Close" onClick={() => setOpen(null)}>
                  <Icon name="close" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
