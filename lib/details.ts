import type { QA } from '@/components/Accordion';
import type { Video } from '@/components/VideoPlayer';

// Long-form content for detail pages. Draft copy for the owner to review; bracketed
// values and "[confirm]" lines are placeholders to replace before launch.

export type Block = { h: string; p?: string[]; list?: string[]; tip?: string };

/* ---------- Addons ---------- */

export type AddonDetail = {
  buyUrl: string; // Superhive or checkout link [replace]
  version: string;
  updated: string;
  features: { title: string; text: string }[];
  steps: string[];
  requirements: string[];
  faq: QA[];
};

const addonFaq: QA[] = [
  { q: 'Can I use it on client work?', a: 'Yes. Every licence allows paid client work. Studio licences cover a team.' },
  { q: 'How do I install it?', a: 'In Blender, open Edit > Preferences > Add-ons, choose Install from Disk and pick the .zip you downloaded. Do not unzip it first.' },
  { q: 'Do I get updates?', a: 'Yes, updates are free. Download the latest version from wherever you bought the addon.' },
];

export const ADDON_DETAILS: Record<string, AddonDetail> = {
  'batch-render-pro': {
    buyUrl: 'https://superhivemarket.com/', // [replace with the product link]
    version: '[1.0]',
    updated: '[Date]',
    features: [
      { title: 'Queue many .blend files', text: 'Add scenes to a list and render them back to back without opening each one.' },
      { title: 'Settings per file', text: 'Each file keeps its own camera, frame range, resolution and output path.' },
      { title: 'Runs unattended', text: 'Start the queue at the end of the day and come back to finished renders.' },
      { title: 'Leaves sources alone', text: 'Your original .blend files are not changed by the queue. [confirm]' },
    ],
    steps: ['Open the Batch Render panel in the sidebar.', 'Add the .blend files you want to render.', 'Check or change the settings for each file.', 'Press Render queue and leave it running.'],
    requirements: ['Blender 4.2 LTS or newer', 'Windows, macOS or Linux', 'Cycles or EEVEE'],
    faq: addonFaq,
  },
  'clay-render-pro': {
    buyUrl: '',
    version: '[1.0]',
    updated: '[Date]',
    features: [
      { title: 'One-click clay look', text: 'Override every material with a clean clay shader for previews. [confirm]' },
      { title: 'Materials untouched', text: 'Switch back to the full look at any time. [confirm]' },
      { title: 'Keeps glass readable', text: '[Describe how transparent parts are handled.]' },
      { title: 'Preview presets', text: '[Describe the presets.]' },
    ],
    steps: ['Open the Clay Render panel.', 'Choose a clay preset.', 'Render or view in the viewport.', 'Turn it off to return to your materials.'],
    requirements: ['Blender 4.2 LTS or newer', 'Cycles or EEVEE'],
    faq: addonFaq,
  },
  'smart-texture-loader': {
    buyUrl: '',
    version: '[1.0]',
    updated: '[Date]',
    features: [
      { title: 'Folder in, material out', text: 'Point it at a folder of PBR maps and get a connected material. [confirm]' },
      { title: 'Reads common names', text: 'Recognises base colour, roughness, metallic, normal and height maps by filename. [confirm]' },
      { title: 'Correct colour spaces', text: 'Data maps are set to Non-Color automatically. [confirm]' },
      { title: 'Batch mode', text: '[Describe loading several materials at once.]' },
    ],
    steps: ['Select an object.', 'Open the Smart Texture Loader panel.', 'Choose the texture folder.', 'Press Build material.'],
    requirements: ['Blender 4.2 LTS or newer'],
    faq: addonFaq,
  },
  'simple-texture-baker': {
    buyUrl: '',
    version: '[1.0]',
    updated: '[Date]',
    features: [
      { title: 'Bake presets', text: 'Common map sets ready to bake from one panel. [confirm]' },
      { title: 'Sensible defaults', text: '[Describe margins, resolution and file output.]' },
      { title: 'Batch objects', text: '[Describe baking several objects.]' },
      { title: 'Saves the maps', text: '[Describe naming and folders.]' },
    ],
    steps: ['Select the objects to bake.', 'Choose a preset.', 'Set the resolution.', 'Press Bake.'],
    requirements: ['Blender 4.2 LTS or newer', 'Cycles'],
    faq: addonFaq,
  },
  'drive-it': {
    buyUrl: '',
    version: '[0.9 beta]',
    updated: '[Date]',
    features: [
      { title: 'One-click rig', text: 'Rig a vehicle body and wheels in one step. [confirm]' },
      { title: 'Wheels that roll', text: 'Wheel rotation follows the distance travelled. [confirm]' },
      { title: 'Turntable ready', text: '[Describe turntable mode.]' },
      { title: 'Path driving', text: '[Describe following a curve.]' },
    ],
    steps: ['Name the body and wheel objects.', 'Open the Drive it panel.', 'Press Rig vehicle.', 'Animate the control or pick a path.'],
    requirements: ['Blender 4.2 LTS or newer'],
    faq: addonFaq,
  },
};

/* ---------- Course ---------- */

export const COURSE_DETAIL = {
  slug: 'product-visualization-masterclass',
  duration: '[00] hours',
  updated: '[Date]',
  outcomes: [
    'Model a product accurately from reference photos or CAD',
    'Build glass, plastic, metal and label materials in Blender and Substance Painter',
    'Light a product in a studio setup and in a lifestyle scene',
    'Render, composite and deliver images for e-commerce and ads',
  ],
  modules: [
    { title: 'Planning and references', lessons: ['How client briefs turn into a shot list', 'Collecting references', 'Setting up the project'] },
    { title: 'Modelling the product', lessons: ['Blocking from references', 'Clean topology for hard-surface products', 'Labels and UVs'] },
    { title: 'Materials', lessons: ['Glass and liquids', 'Plastics and metals', 'Texturing labels in Substance Painter'] },
    { title: 'Lighting', lessons: ['A three-light studio', 'Dark cards and strip lights', 'Lifestyle scenes'] },
    { title: 'Rendering and delivery', lessons: ['Render settings and passes', 'Compositing', 'Exporting for marketplaces and ads'] },
  ],
  requirements: ['Blender 4.2 or newer', 'Basic knowledge of the Blender interface', 'Substance Painter for the texturing module (optional)'],
  faq: [
    { q: 'Do I get the project files?', a: 'Yes, every lesson comes with its scene file.' },
    { q: 'How long do I have access?', a: '[Lifetime access or a set period: confirm.]' },
    { q: 'Is it included in the membership?', a: 'It is included in Pro. Basic members get a member price. [confirm]' },
  ] as QA[],
};

/* ---------- Case study ---------- */

export const CASE_STUDY = {
  slug: 'plant-based-sleeping-mask',
  // Interactive 3D model: run `npm run models` with models-src/plant-based-sleeping-mask.glb
  model: '/models/plant-based-sleeping-mask.glb',
  title: 'Plant-based sleeping mask launch visuals',
  lead: 'A packshot and lifestyle render set for a skincare launch, built from dielines before the first jar was produced.',
  facts: [
    { k: 'Client', v: '[Brand name]' },
    { k: 'Services', v: 'Product visualization' },
    { k: 'Deliverables', v: '[6] packshots, [2] lifestyle scenes' },
    { k: 'Timeline', v: '[00] working days' },
  ],
  sections: [
    { h: 'The brief', p: ['[Brand name] needed launch images for its store and marketplace listings, but production samples would not arrive until after pre-orders opened. [Confirm or rewrite with the real brief.]'] },
    { h: 'Modelling from dielines', p: ['We built the jar and lid from the packaging dielines and supplier drawings, then matched label proportions to the printed artwork.'] },
    { h: 'Clay previews', p: ['Before any lighting or materials, the client approved every camera angle and composition in clay. Changes at this stage cost minutes rather than hours.'] },
    { h: 'Frosted glass and final renders', p: ['Frosted glass needs soft, broad light to read as a material rather than a grey shape. We lit with large softboxes and a dark card behind the jar to hold its edge.'] },
  ] as Block[],
  result: '[Result in the client’s words or a measurable outcome, once approved.]',
};

/* ---------- Animation ---------- */

export const FILM_DETAIL = {
  slug: 'wireless-earbuds-launch-film',
  video: { provider: 'none' } as Video, // [replace] e.g. { provider: 'vimeo', id: '123456789' }
  title: 'Wireless earbuds launch film',
  lead: 'A 45-second launch film with three vertical cut-downs for social, built in Blender and finished in After Effects.',
  facts: [
    { k: 'Client', v: '[Brand name]' },
    { k: 'Length', v: '[0:45] plus 3 cut-downs' },
    { k: 'Tools', v: 'Blender, After Effects' },
    { k: 'Delivered', v: '16:9, 9:16, 1:1' },
  ],
  sections: [
    { h: 'The idea', p: ['[What the film had to say and where it would run.]'] },
    { h: 'Storyboard and animatic', p: ['Timing and camera moves were approved in grey before lighting started, so the edit was locked early.'] },
    { h: 'Lighting and render', p: ['[Notes on the look: materials, lighting, render engine.]'] },
    { h: 'Cut-downs', p: ['The vertical edits were planned in the storyboard, with each shot framed to work at 9:16 as well as 16:9.'] },
  ] as Block[],
  cuts: [
    { title: 'Reveal cut', duration: '[0:15]', ratio: '9:16' },
    { title: 'Feature cut', duration: '[0:15]', ratio: '9:16' },
    { title: 'Loop', duration: '[0:06]', ratio: '1:1' },
  ],
};

// Blog article text lives in content/blog/*.md (see lib/blog.ts).
