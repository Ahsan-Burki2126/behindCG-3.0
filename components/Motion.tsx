'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Site-wide motion, built on GSAP + ScrollTrigger + SplitText. Loaded lazily (MotionLoader)
// so it never delays the first paint, and re-run on every route.
//
// Rules that keep it fast and safe:
// - The hero (headline, lead, buttons, main render) animates with CSS keyframes that start
//   before JavaScript, so the largest content paints immediately (good LCP).
// - Only `html.motion` pre-hides anything (set in the layout unless the visitor prefers
//   reduced motion; removed after 6s if this file never runs). If the fail-safe already fired,
//   we leave the page static rather than hide visible content again.
// - Below-the-fold blocks are hidden only once GSAP runs, and every tween clears its inline
//   styles when done, so CSS hover effects keep working.
// - Continuous motion stops: floating cards drift a few times, the marquee pauses offscreen
//   and has a pause button (WCAG 2.2.2).

const REVEAL = [
  '.sh', '.g2>*', '.g3>*', '.g4>*:not(.step)', '.masonry>*', '.feature>*', '.tools>*', '.acc-item', '.close',
  '.brand-band', '.plans>*', '.facts>div', '.svc-list li', '.split>*', '.door-links li',
  '.eps li', '.modules>li', '.principles li', '.socials-grid>*', '.checks li', '.prose>h2',
].join(',');
const IMAGES = '.feature>.ph, .deliver-img, .how-media>.ph, .feature>.mv';
const HEADINGS = '.sh h2, .feature h2, .close h2, .brand-band h2, .how h2';
const EXCLUDE = '.page-hero, .hero, .mega, .mnav, .hs, .foot';

declare global {
  interface Window { __bcgMotion?: boolean }
}

export default function Motion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const html = document.documentElement;
      // Fail-safe already removed motion (slow device): keep the page static.
      if (!window.__bcgMotion && !html.classList.contains('motion')) return;
      window.__bcgMotion = true;
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 1025px)',
          fine: '(hover: hover) and (pointer: fine)',
        },
        (ctx) => {
          const { motion, desktop, fine } = ctx.conditions as Record<string, boolean>;
          if (!motion) {
            html.classList.remove('motion');
            return;
          }
          html.classList.add('motion');
          const fold = window.innerHeight * 0.92;
          const below = (el: Element) => !el.closest(EXCLUDE) && el.getBoundingClientRect().top > fold;

          /* ---------- Hero extras (the copy and main render animate in CSS) ---------- */
          const hv = document.querySelector<HTMLElement>('.hv');
          if (hv) {
            const main = hv.querySelector<HTMLElement>('.hv-main');
            const inset = hv.querySelector('.hv-inset');
            const chip = hv.querySelector('.hv-chip');
            if (inset) {
              gsap.fromTo(inset, { x: -50, y: 30, autoAlpha: 0, rotate: -4 }, { x: 0, y: 0, autoAlpha: 1, rotate: 0, duration: 1.2, delay: 0.35, ease: 'expo.out' });
              gsap.to(inset, { y: -12, duration: 3.6, repeat: 5, yoyo: true, ease: 'sine.inOut', delay: 1.6 });
            }
            if (chip) {
              gsap.fromTo(chip, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, delay: 0.6, ease: 'back.out(2)' });
              gsap.to(chip, { y: -8, duration: 3, repeat: 5, yoyo: true, ease: 'sine.inOut', delay: 1.6 });
            }
            // Cursor parallax on the main render
            if (fine && main) {
              const xTo = gsap.quickTo(main, 'x', { duration: 0.8, ease: 'power3.out' });
              const yTo = gsap.quickTo(main, 'y', { duration: 0.8, ease: 'power3.out' });
              const onMove = (e: PointerEvent) => {
                const r = hv.getBoundingClientRect();
                xTo(((e.clientX - r.left) / r.width - 0.5) * 18);
                yTo(((e.clientY - r.top) / r.height - 0.5) * 18);
              };
              const onLeave = () => { xTo(0); yTo(0); };
              hv.addEventListener('pointermove', onMove);
              hv.addEventListener('pointerleave', onLeave);
              ctx.add(() => () => { hv.removeEventListener('pointermove', onMove); hv.removeEventListener('pointerleave', onLeave); });
            }
          }

          // Home hero floating labels: pop in, drift a few times, then rest.
          gsap.utils.toArray<HTMLElement>('.hero-float .hv-chip').forEach((c, i) => {
            gsap.fromTo(c, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, delay: 0.7 + i * 0.18, ease: 'back.out(2)' });
            gsap.to(c, { y: i % 2 ? 10 : -10, duration: 3 + i * 0.4, repeat: 5, yoyo: true, ease: 'sine.inOut', delay: 1.6 + i * 0.3 });
          });
          // Home hero: the scene drifts as you scroll past it.
          if (document.querySelector('.hero .hero-media')) {
            gsap.to('.hero .hero-media', { yPercent: 12, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
          }

          /* ---------- Section headings: line-by-line mask reveal ---------- */
          gsap.utils.toArray<HTMLElement>(HEADINGS).filter(below).forEach((h) => {
            SplitText.create(h, {
              type: 'lines',
              mask: 'lines',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, { yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } }),
            });
          });

          /* ---------- Big images: clip-path wipe + inner parallax ---------- */
          const images = gsap.utils.toArray<HTMLElement>(IMAGES).filter(below);
          images.forEach((el) => {
            gsap.fromTo(
              el,
              { clipPath: 'inset(14% 10% 14% 10% round 24px)', autoAlpha: 0.2 },
              { clipPath: 'inset(0% 0% 0% 0% round 16px)', autoAlpha: 1, duration: 1.5, ease: 'expo.out', clearProps: 'clipPath,opacity,visibility', scrollTrigger: { trigger: el, start: 'top 86%', once: true } }
            );
            const inner = el.querySelector('.ph-img');
            if (inner) {
              gsap.fromTo(inner, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
            }
          });

          /* ---------- Everything else: staggered batches ---------- */
          const imageSet = new Set<Element>(images);
          const blocks = gsap.utils.toArray<HTMLElement>(REVEAL).filter((el) => below(el) && !imageSet.has(el));
          if (blocks.length) {
            gsap.set(blocks, { autoAlpha: 0, y: 48 });
            ScrollTrigger.batch(blocks, {
              start: 'top 90%',
              once: true,
              onEnter: (els) =>
                // 'auto' only replaces the properties we animate here, so other tweens on the
                // same elements (like the step lines) keep running.
                gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, ease: 'expo.out', overwrite: 'auto', clearProps: 'transform,opacity,visibility' }),
            });
          }

          /* ---------- Process steps: fade up and draw their line ---------- */
          gsap.utils.toArray<HTMLElement>('.steps').forEach((list) => {
            const steps = list.querySelectorAll<HTMLElement>('.step');
            if (!steps.length) return;
            const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: 'top 85%', once: true } });
            tl.fromTo(steps, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out', clearProps: 'transform,opacity,visibility' })
              .fromTo(steps, { backgroundSize: '0% 2px' }, { backgroundSize: '100% 2px', duration: 1.1, stagger: 0.12, ease: 'expo.inOut' }, 0.1);
          });

          /* ---------- Home: sticky horizontal showcase (no pinning → no layout shift) ---------- */
          const hs = document.querySelector<HTMLElement>('.hs');
          const track = hs?.querySelector<HTMLElement>('.hs-track');
          const viewport = hs?.querySelector<HTMLElement>('.hs-viewport');
          if (hs && track && viewport && desktop) {
            hs.classList.add('hs-pinned');
            const pad = () => parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
            // Travel until the last card's right edge meets the content edge.
            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + pad() * 2);
            const runway = () => distance() * 0.75; // scroll length: a bit shorter than the travel
            const setHeight = () => hs.style.setProperty('--hs-run', `${runway()}px`);
            setHeight();
            const tween = gsap.to(track, {
              x: () => -distance(),
              ease: 'none',
              scrollTrigger: { trigger: hs, start: 'top top', end: () => `+=${runway()}`, scrub: 0.6, invalidateOnRefresh: true, onRefreshInit: setHeight },
            });
            const bar = hs.querySelector('.hs-progress span');
            if (bar) gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: hs, start: 'top top', end: () => `+=${runway()}`, scrub: true, invalidateOnRefresh: true } });
            track.querySelectorAll<HTMLElement>('.hs-card').forEach((card) => {
              const media = card.querySelector('.ph');
              if (media) gsap.fromTo(media, { scale: 0.92, rotate: 2 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'left 70%', scrub: true } });
            });
            ctx.add(() => () => { hs.classList.remove('hs-pinned'); hs.style.removeProperty('--hs-run'); });
          }

          /* ---------- Marquee: follows scroll speed, pauses offscreen, has a pause button ---------- */
          const marquee = document.querySelector<HTMLElement>('.marquee');
          const mTrack = marquee?.querySelector<HTMLElement>('.marquee-track');
          if (marquee && mTrack) {
            const loop = gsap.to(mTrack, { xPercent: -50, repeat: -1, duration: 38, ease: 'none', paused: true });
            const toggle = marquee.querySelector<HTMLButtonElement>('.marquee-toggle');
            let userPaused = false;
            let dir = 1;
            let lastBoost = 0;
            ScrollTrigger.create({
              trigger: marquee,
              start: 'top bottom',
              end: 'bottom top',
              onToggle: (self) => { if (!userPaused) (self.isActive ? loop.play() : loop.pause()); },
              onUpdate: (self) => {
                if (userPaused) return;
                if (self.direction !== dir) dir = self.direction;
                const now = performance.now();
                if (now - lastBoost < 80) return; // throttle
                lastBoost = now;
                const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
                gsap.to(loop, { timeScale: dir * boost, duration: 0.25, overwrite: true, onComplete: () => { gsap.to(loop, { timeScale: dir, duration: 1.2 }); } });
              },
            });
            if (toggle) {
              toggle.hidden = false;
              const onClick = () => {
                userPaused = !userPaused;
                if (userPaused) loop.pause(); else loop.play();
                toggle.setAttribute('aria-pressed', String(userPaused));
                toggle.setAttribute('aria-label', userPaused ? 'Play the scrolling list' : 'Pause the scrolling list');
              };
              toggle.addEventListener('click', onClick);
              ctx.add(() => () => { toggle.removeEventListener('click', onClick); toggle.hidden = true; });
            }
          }

          /* ---------- Header: tucks away on scroll down, returns on scroll up ---------- */
          const nav = document.querySelector<HTMLElement>('.nav');
          if (nav) {
            ScrollTrigger.create({
              start: 0,
              end: 'max',
              onUpdate: (self) => {
                const menuOpen = !!document.querySelector('.mega, .mnav');
                nav.classList.toggle('nav-hidden', self.direction === 1 && self.scroll() > 320 && !menuOpen);
              },
            });
            ctx.add(() => () => nav.classList.remove('nav-hidden'));
          }

          /* ---------- Reading progress (articles) ---------- */
          const progress = document.querySelector('.read-progress span');
          const article = document.querySelector('article');
          if (progress && article) {
            gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: article, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
          }

          /* ---------- Magnetic primary buttons ---------- */
          if (fine) {
            gsap.utils.toArray<HTMLElement>('.btn-primary, .mv-start').forEach((btn) => {
              btn.classList.add('magnetic');
              const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
              const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
              const move = (e: PointerEvent) => {
                const r = btn.getBoundingClientRect();
                xTo((e.clientX - r.left - r.width / 2) * 0.28);
                yTo((e.clientY - r.top - r.height / 2) * 0.4);
              };
              const leave = () => { gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }); };
              btn.addEventListener('pointermove', move);
              btn.addEventListener('pointerleave', leave);
              ctx.add(() => () => { btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerleave', leave); btn.classList.remove('magnetic'); gsap.set(btn, { clearProps: 'transform' }); });
            });
          }

          /* ---------- Spotlight that follows the cursor on dark cards ---------- */
          if (fine) {
            const spot = (e: PointerEvent) => {
              const el = (e.target as HTMLElement).closest<HTMLElement>('.spot, .card, .tool, .fit-card, .social-tile, .m-feat');
              if (!el) return;
              const r = el.getBoundingClientRect();
              el.style.setProperty('--mx', `${e.clientX - r.left}px`);
              el.style.setProperty('--my', `${e.clientY - r.top}px`);
            };
            document.addEventListener('pointermove', spot, { passive: true });
            ctx.add(() => () => document.removeEventListener('pointermove', spot));
          }

          // Layout settles after fonts and lazy images: recompute trigger positions.
          document.fonts?.ready.then(() => ScrollTrigger.refresh());
          const onLoad = () => ScrollTrigger.refresh();
          window.addEventListener('load', onLoad);
          ctx.add(() => () => window.removeEventListener('load', onLoad));
        }
      );

      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return null;
}
