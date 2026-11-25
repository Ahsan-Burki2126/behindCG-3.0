import 'server-only';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import type { Obj, Tone } from '@/components/Render';

// The blog is a folder of Markdown files: content/blog/<slug>.md. Add a file, push, and the
// post is live (listing, article page, sitemap, social image and structured data).
// Front matter fields are documented in content/blog/README.md.
// Markdown is rendered as HTML without sanitizing, so only people with repository access
// can publish: never feed visitor-submitted text into this folder.

export const POST_CATEGORIES = ['Tutorial', 'Breakdown', 'Guide'];

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // YYYY-MM-DD, or a [placeholder]
  updated: string;
  read: string;
  tone: Tone;
  obj: Obj;
  img: string;
  html: string;
  headings: { id: string; text: string }[];
  draft: boolean;
};

const DIR = join(process.cwd(), 'content', 'blog');
const slugify = (s: string) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function render(md: string) {
  const headings: Post['headings'] = [];
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2) headings.push({ id, text: text.replace(/<[^>]+>/g, '') });
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
      // Blockquotes starting with "Tip:" become callouts.
      blockquote({ tokens }) {
        return `<div class="callout">${this.parser.parse(tokens)}</div>`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        return `<a href="${href}"${title ? ` title="${title}"` : ''}${external ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
      },
      image({ href, title, text }) {
        return `<img src="${href}" alt="${text}" loading="lazy" decoding="async"${title ? ` title="${title}"` : ''} />`;
      },
    },
  });
  const html = marked.parse(md, { async: false }) as string;
  return { html, headings };
}

function readTime(md: string) {
  const words = md.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

let cache: Post[] | null = null;

export function getAllPosts({ includeDrafts = false } = {}): Post[] {
  if (!cache) {
    cache = readdirSync(DIR)
      .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
      .map((file) => {
        const slug = file.replace(/\.md$/, '');
        const { data, content } = matter(readFileSync(join(DIR, file), 'utf8'));
        const { html, headings } = render(content);
        const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '[Date]');
        return {
          slug,
          title: String(data.title ?? slug),
          description: String(data.description ?? ''),
          category: String(data.category ?? 'Guide'),
          date,
          updated: data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '2026-11-01',
          read: data.read ? String(data.read) : readTime(content),
          tone: (data.tone ?? 'teal') as Tone,
          obj: (data.obj ?? 'default') as Obj,
          img: String(data.cover ?? `/images/blog/${slug}.jpg`),
          html,
          headings,
          draft: data.draft === true,
        };
      })
      // Newest first; undated placeholders keep their file order after dated posts.
      .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
  }
  return includeDrafts ? cache : cache.filter((p) => !p.draft);
}

export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug);
