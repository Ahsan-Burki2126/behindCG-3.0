import { slugify } from '@/lib/catalog';
import type { Block } from '@/lib/details';

// Renders structured long-form content (lib/details.ts) as prose with anchored h2s.
export default function Prose({ blocks, children }: { blocks: Block[]; children?: React.ReactNode }) {
  return (
    <div className="prose">
      {children}
      {blocks.map((b) => (
        <section key={b.h} id={slugify(b.h)} className="prose-sec">
          <h2>{b.h}</h2>
          {b.p?.map((t) => <p key={t}>{t}</p>)}
          {b.list && <ul>{b.list.map((t) => <li key={t}>{t}</li>)}</ul>}
          {b.tip && <p className="callout"><strong>Tip:</strong> {b.tip}</p>}
        </section>
      ))}
    </div>
  );
}

export function Toc({ blocks, label = 'On this page' }: { blocks: Block[]; label?: string }) {
  return (
    <nav className="toc" aria-label={label}>
      {blocks.map((b) => <a key={b.h} href={`#${slugify(b.h)}`}>{b.h}</a>)}
    </nav>
  );
}

export function Facts({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className="facts">
      {items.map((f) => (
        <div key={f.k}>
          <dt>{f.k}</dt>
          <dd>{f.v}</dd>
        </div>
      ))}
    </dl>
  );
}
