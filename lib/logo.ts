// Behind CG logo, redrawn as vector from the owner's original artwork (1600px canvas).
// Shapes are shared by the site header/footer (components/Logo.tsx), the social images
// (lib/og.tsx) and the favicon (app/icon.svg). Replace with the designer's master SVG
// when available; keep the same viewBox so nothing else needs to change.

export const LOGO_COLORS = { teal: '#038584', bright: '#10C4B4', orange: '#FD8F3D' } as const;

export const LOGO_PATHS = {
  // The "C": a ring whose top band runs right into the G's outer curve.
  c: 'M605 332H1010A401 401 0 0 1 1325 487H605A246 246 0 1 0 796 888V1086A401 401 0 1 1 605 332Z',
  // The "G": a ring opening at the top-left, with its crossbar.
  g: 'M1403 662A401 401 0 0 1 816 1086V887A246 246 0 0 0 1243 800H1007V662Z',
  // Bright-teal accents: inner band under the C, the G's lower bar, and the base swoosh.
  band: 'M375 752A245 245 0 0 1 620 507H1333L1352 529H620A262 262 0 0 0 375 752Z',
  bar: 'M1005 815H1224L1217 837H1005Z',
  swoosh: 'M192 752A413 430 0 0 0 808 1127A413 430 0 0 0 1423 752H1419A409 406 0 0 1 808 1104A409 406 0 0 1 196 752Z',
} as const;

// "BEHIND" sits in the C's opening: left 817, cap top 549, baseline 643, width 530.
export const LOGO_WORD = { x: 817, y: 643, width: 530, size: 131 } as const;
export const LOGO_TAGLINE = { x: 433, y: 1240, width: 785, size: 40 } as const;

export const LOGO_VIEWBOX = { mark: '180 320 1255 875', full: '180 320 1255 935' } as const;
