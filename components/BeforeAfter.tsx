'use client';

import { useState } from 'react';
import Icon from './Icon';

// Clay-to-final comparison. The range input does the work, so it is keyboard and
// screen-reader operable; the line and handle are visual only.
export default function BeforeAfter({ before, after, label }: { before: React.ReactNode; after: React.ReactNode; label: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="ba">
      {after}
      <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>
      <span className="ba-tag" style={{ left: 24 }}>Clay</span>
      <span className="ba-tag" style={{ right: 24 }}>Final</span>
      <span className="ba-line" style={{ left: `${pos}%` }} />
      <span className="ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
        <Icon name="chevron" className="ic ba-l" />
        <Icon name="chevron" className="ic ba-r" />
      </span>
      <input
        className="ba-range"
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={`${pos}% clay`}
      />
    </div>
  );
}
