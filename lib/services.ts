import type { QA } from '@/components/Accordion';
import type { Obj, Tone } from '@/components/Render';

// Content for the four service pages. Bracketed values are placeholders to confirm.
export type Service = {
  path: '/services/product-visualization' | '/services/product-animation' | '/services/blender-addon-development' | '/services/ai-automation';
  name: string;
  short: string;
  h1: string;
  lead: string;
  render: { tone: Tone; obj: Obj; alt: string };
  img: string; // /public path; falls back to the stand-in
  deliverables: string[];
  goodFor: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  start: string;
  faq: QA[];
  secondary?: { href: string; label: string };
};

export const SERVICES: Service[] = [
  {
    path: '/services/product-visualization',
    img: '/images/services/product-visualization.jpg',
    name: 'Product visualization',
    short: 'Packshots, lifestyle scenes and colour variants for stores and ads.',
    h1: '3D product visualization for e‑commerce and ads',
    lead: 'Photoreal renders from your CAD files or photos: marketplace packshots, lifestyle scenes, colour variants and detail shots.',
    render: { tone: 'cool', obj: 'jar', alt: 'Skincare jar packshot on a pale stone set' },
    deliverables: ['White-background packshots for Amazon and marketplaces', 'Lifestyle scenes for ads and your store', 'Every colour and size variant from one model', 'Close-up detail and material shots', 'Exploded and cutaway views'],
    goodFor: [
      { title: 'Products that are not made yet', text: 'Sell from pre-order with renders built from CAD files or dielines.' },
      { title: 'Large colour ranges', text: 'One model, every variant, with identical lighting and angles.' },
      { title: 'Hard-to-shoot materials', text: 'Glass, chrome and liquids without reflections of the crew.' },
    ],
    steps: [
      { title: 'Brief', text: 'Files, references and where the images will run.' },
      { title: 'Clay previews', text: 'You approve angles and composition in grey.' },
      { title: 'Look development', text: 'Materials, labels and lighting, reviewed on one hero shot.' },
      { title: 'Delivery', text: 'Full-resolution files cropped for every channel.' },
    ],
    start: 'Projects start from $[000]. [confirm]',
    faq: [
      { q: 'What files do you need?', a: 'CAD (STEP, OBJ, FBX) is fastest. Dielines and good photos from several angles also work. We tell you in the quote if anything is missing.' },
      { q: 'How long does a project take?', a: 'A typical packshot set takes [00] working days from approved brief. The quote gives you a date.' },
      { q: 'Who owns the renders?', a: 'You get full commercial usage rights on delivery and final payment. See the terms for details.' },
    ],
    secondary: { href: '/portfolio', label: 'See the portfolio' },
  },
  {
    path: '/services/product-animation',
    img: '/images/services/product-animation.jpg',
    name: 'Product animation',
    short: 'Launch films and social cut-downs rendered in Blender.',
    h1: '3D product animation for launches and social',
    lead: 'Launch films, social reels, turntables and explainers rendered in Blender and cut for YouTube, Reels, TikTok and product pages.',
    render: { tone: 'teal', obj: 'round', alt: 'Still from a product film: earbuds case mid-rotation' },
    deliverables: ['Launch films from 15 to 90 seconds', 'Vertical cut-downs for Reels, TikTok and Shorts', 'Seamless turntables for product pages', 'Feature explainers and exploded views', 'Sound design and music licensing on request'],
    goodFor: [
      { title: 'Launches', text: 'A hero film plus cut-downs, delivered together for launch day.' },
      { title: 'Paid social', text: 'Short loops built to stop the scroll in the first second.' },
      { title: 'Technical products', text: 'Show how it works inside without a single prototype.' },
    ],
    steps: [
      { title: 'Brief and script', text: 'Message, length and every platform you post on.' },
      { title: 'Storyboard and animatic', text: 'Timing and camera moves approved in grey.' },
      { title: 'Lighting and render', text: 'Look development on key frames, then the full render.' },
      { title: 'Edit and delivery', text: 'Grade, sound and every cut-down in one handover.' },
    ],
    start: 'Films start from $[0,000]. [confirm]',
    faq: [
      { q: 'Can you reuse the model from a render project?', a: 'Yes. If we already made your stills, the film starts from the same model and materials, which saves time and cost.' },
      { q: 'Do you add music and voice-over?', a: 'We license music and can arrange voice-over. Both are listed separately in the quote.' },
      { q: 'What formats do you deliver?', a: 'MP4 (H.264 or H.265) at every aspect ratio you need, plus ProRes on request.' },
    ],
    secondary: { href: '/animations', label: 'Watch the films' },
  },
  {
    path: '/services/blender-addon-development',
    img: '/images/services/blender-addon-development.jpg',
    name: 'Blender addon development',
    short: 'Custom Python tools and panels for studios.',
    h1: 'Custom Blender addon development',
    lead: 'Python tools and panels for studios: batch rendering, export automation, scene setup and pipeline helpers, from the team behind Batch Render Pro.',
    render: { tone: 'wire', obj: 'box', alt: 'Custom panel docked in the Blender sidebar' },
    deliverables: ['Studio panels for repeated scene setup', 'Batch render and export automation', 'Naming, file and asset pipeline tools', 'Integration with your file storage or render farm', 'Documentation and handover to your team'],
    goodFor: [
      { title: 'Repeated setup work', text: 'Turn a 20-step scene setup into one button.' },
      { title: 'Studios with a pipeline', text: 'Tools that follow your naming, folders and render settings.' },
      { title: 'Product teams', text: 'Let non-3D staff produce variants from a locked template.' },
    ],
    steps: [
      { title: 'Workflow review', text: 'We watch how your team works today.' },
      { title: 'Spec and quote', text: 'What the tool does, what it does not, and the price.' },
      { title: 'Build and test', text: 'Working builds you try on real scenes as we go.' },
      { title: 'Handover', text: 'Source code, docs and a support period.' },
    ],
    start: 'Tools start from $[000]. [confirm]',
    faq: [
      { q: 'Which Blender versions do you support?', a: 'We build for the current LTS release by default and can target the versions your studio runs.' },
      { q: 'Do we own the code?', a: 'Yes, custom tools are handed over with source code. The licence terms are set out in the quote.' },
      { q: 'Can you extend one of your existing addons?', a: 'Often, yes. Tell us what you need in the brief.' },
    ],
    secondary: { href: '/addons', label: 'See our addons' },
  },
  {
    path: '/services/ai-automation',
    img: '/images/services/ai-automation.jpg',
    name: 'AI and social automation',
    short: 'n8n workflows for posting, captions and client intake.',
    h1: 'AI and social media automations with n8n',
    lead: 'n8n workflows for creative teams: auto-posting to Instagram, TikTok and LinkedIn, render-to-reel and caption automation, and client intake into your CRM.',
    render: { tone: 'teal', obj: 'can', alt: 'Workflow diagram of nodes connecting a render folder to social channels' },
    deliverables: ['Scheduled posting to Instagram, TikTok, LinkedIn and Facebook', 'Captions and hashtags drafted with AI, approved by you', 'Render folder to finished reel pipelines', 'Form and email intake into your CRM', 'Hosting and monitoring set-up'],
    goodFor: [
      { title: 'Small teams posting daily', text: 'Hours of copying and uploading every week, handled by a workflow.' },
      { title: 'Studios with steady output', text: 'New renders become drafts for every channel automatically.' },
      { title: 'Lead handling', text: 'Every inquiry lands in one place with a reply on its way.' },
    ],
    steps: [
      { title: 'Audit', text: 'We map the manual steps you repeat today.' },
      { title: 'Design', text: 'A workflow diagram and quote you sign off.' },
      { title: 'Build', text: 'n8n workflows tested on your real accounts.' },
      { title: 'Handover', text: 'Docs, logins and a support period.' },
    ],
    start: 'Workflows start from $[000]. [confirm]',
    faq: [
      { q: 'Do we need to host n8n?', a: 'You can use n8n Cloud or self-host it. We set up whichever suits you and hand over the logins.' },
      { q: 'Does AI post without our approval?', a: 'Only if you want it to. By default, drafts wait for a person to approve them.' },
      { q: 'Which tools can you connect?', a: 'Anything n8n connects to, which covers most social, storage, email and CRM tools.' },
    ],
  },
];

export const serviceByPath = (path: Service['path']) => SERVICES.find((s) => s.path === path)!;
