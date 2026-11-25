'use client';

import { useState } from 'react';

// Filter tabs (44px pills, aria-pressed) over a grid of server-rendered items.
export default function Filter({
  label,
  categories,
  items,
  gridClass = 'masonry',
}: {
  label: string;
  categories: string[];
  items: { key: string; category: string; node: React.ReactNode }[];
  gridClass?: string;
}) {
  const [on, setOn] = useState('All');
  const shown = on === 'All' ? items : items.filter((i) => i.category === on);

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
      <div className={gridClass}>
        {shown.map((i) => (
          <div key={i.key}>{i.node}</div>
        ))}
      </div>
    </>
  );
}
