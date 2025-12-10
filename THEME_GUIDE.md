# Theme Guide 🎨

## Video
- https://www.youtube.com/watch?v=5lBSrSPhjw8

## Tools
- TweakCN (recommended): https://tweakcn.com/editor/theme
- Shadcn Theme Generator: https://zippystarter.com/tools/shadcn-ui-theme-generator

## Quick steps (BesideAI)
1) Generate theme in TweakCN (light & dark).
2) Copy exported CSS variables.
3) Update `src/app/globals.css` `:root` and `.dark` blocks.
4) Save, reload. All components will follow the new palette.

## Variables to edit (HSL/oklch)
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--accent`, `--accent-foreground`
- `--muted`, `--muted-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--radius` (corner rounding)

## Fonts
- Set in `tailwind.config.ts` under `theme.extend.fontFamily`
  - `sans`: primary UI font
  - `heading`: optional heading font

## Dark mode
- `.dark { ... }` in `globals.css` holds dark variants.
- Theme switcher already wired; just ensure dark variables are set.

## Tips
- Start from a close palette, then tweak.
- Check contrast (accessibility) in builder.
- Keep brand consistency: primary = brand color; secondary for surfaces.
- Avoid hardcoded colors in components; rely on CSS vars.

## Troubleshooting
- Colors not applying: ensure edits are in `globals.css` and file is imported in root layout.
- Dark mode off: verify `.dark` variables and that the switcher toggles `.dark` class.
- Inconsistent colors: search for hardcoded hex and replace with CSS vars.


