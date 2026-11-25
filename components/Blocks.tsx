import Link from 'next/link';
import Icon from './Icon';
import Render from './Render';
import type { AddonItem, WorkItem } from '@/lib/catalog';

// Small server components shared across pages.

export function PageHero({
  title,
  lead,
  crumbs,
  visual,
  children,
}: {
  title: string;
  lead: string;
  crumbs?: { href: string; label: string }[];
  visual?: React.ReactNode; // usually <HeroVisual>; omit for text pages such as legal
  children?: React.ReactNode;
}) {
  const text = (
    <div className="hero-text">
      {crumbs && (
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            {crumbs.map((c) => (
              <li key={c.href} className="crumbs">
                <Link href={c.href}>{c.label}</Link>
                <span aria-hidden="true">/</span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="h1">{title}</h1>
      <p className="lead">{lead}</p>
      {children && <div className="row">{children}</div>}
    </div>
  );
  return (
    <section className={`page-hero${visual ? ' has-visual' : ''}`}>
      <div className={visual ? 'wrap hero-split' : 'wrap'}>
        {text}
        {visual}
      </div>
    </section>
  );
}

export function SectionHead({ id, title, lead, children }: { id: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="sh">
      <div className="sh-text">
        <h2 className="h2" id={id}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {children}
    </div>
  );
}

export function CloseCta({
  title = 'Launching a product soon?',
  lead = 'Tell us what it is and when it ships. You get a plan and a fixed quote within two working days.',
  secondary,
}: {
  title?: string;
  lead?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="sec" aria-labelledby="close-h">
      <div className="wrap">
        <div className="close">
          <h2 className="h2" id="close-h">{title}</h2>
          <p className="lead">{lead}</p>
          <div className="row">
            <Link className="btn btn-primary" href="/get-a-quote">Get a Quote</Link>
            {secondary && (
              <Link className="btn btn-ghost" href={secondary.href}>{secondary.label}<Icon name="arrow" /></Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkCard({ item, ratio = 'r43' }: { item: WorkItem; ratio?: 'r43' | 'r45' | 'r11' }) {
  const inner = (
    <>
      <Render src={item.img} ratio={ratio} tone={item.tone} obj={item.obj} alt={item.alt} />
      <div className="p-info">
        <div className="stack" style={{ gap: 4 }}>
          <span className="cat">{item.category}</span>
          <span className="h4 hl">{item.title}</span>
        </div>
        {item.href && <Icon name="arrowUpRight" />}
      </div>
    </>
  );
  return item.href ? (
    <Link href={item.href} className="card-link">{inner}</Link>
  ) : (
    <div className="card-link is-static">{inner}</div>
  );
}

export function AddonCard({ item }: { item: AddonItem }) {
  return (
    <Link href={`/addons/${item.slug}`} className="card">
      <Render src={item.img} ratio="r43" tone={item.tone} obj={item.obj} alt={`${item.name} panel inside Blender`} />
      <div className="card-body">
        {item.badge && <span className={`badge ${item.badge.kind}`} style={{ alignSelf: 'flex-start' }}>{item.badge.label}</span>}
        <h3 className="h4">{item.name}</h3>
        <p className="md">{item.blurb}</p>
        <div className="card-foot">
          <span className="price">{item.price}</span>
          <span className="sm">Blender {item.blender}</span>
        </div>
      </div>
    </Link>
  );
}

export function FilmCard({ title, category, duration, href, tone, obj, alt, img }: {
  img?: string; title: string; category: string; duration: string; href?: string; tone: WorkItem['tone']; obj: WorkItem['obj']; alt: string;
}) {
  const inner = (
    <>
      <Render src={img} ratio="r169" tone={tone} obj={obj} alt={alt}>
        <span className="play" aria-hidden="true"><Icon name="play" /></span>
        <span className="dur">{duration}</span>
      </Render>
      <div className="p-info">
        <div className="stack" style={{ gap: 4 }}>
          <span className="cat">{category}</span>
          <span className="h4 hl">{title}</span>
        </div>
      </div>
    </>
  );
  return href ? <Link href={href} className="card-link">{inner}</Link> : <div className="card-link is-static">{inner}</div>;
}
