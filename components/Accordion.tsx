'use client';

import { useId, useState } from 'react';
import Icon from './Icon';

export type QA = { q: string; a: string };

export default function Accordion({ items, headingLevel = 3 }: { items: QA[]; headingLevel?: 2 | 3 }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  const H = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div className="acc">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className="acc-item" key={it.q}>
            <H style={{ margin: 0 }}>
              <button
                type="button"
                className={`acc-btn${isOpen ? ' is-open' : ''}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                id={`${id}-b${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {it.q}
                <Icon name="plus" />
              </button>
            </H>
            <div className="acc-panel md" id={`${id}-p${i}`} aria-labelledby={`${id}-b${i}`} hidden={!isOpen}>
              {it.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
