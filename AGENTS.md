<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Project Context: Rolesmith Frontend

Stack:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui for components

Design Guidelines:

- Modern SaaS UI (similar to Linear / Stripe)
- Clean spacing, lots of whitespace
- Rounded corners (lg)
- Soft shadows
- Consistent padding and margins
- Mobile responsive

Code Guidelines:

- Always create reusable components
- Never write large monolithic components
- Separate UI into:
  - /components/ui (will be mostly used by shadcn installs)
  - /components/sections
  - /components/layout
- Use functional React components
- Prefer server components unless interactivity is needed

UI Rules:

- Use Tailwind CSS only (no inline styles)
- Prefer shadcn components when possible
- Keep styling consistent across pages

<!-- END:nextjs-agent-rules -->
