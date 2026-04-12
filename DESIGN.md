# Design System Document: The Binary Monolith

## 1. Overview & Creative North Star

**Creative North Star: The Binary Monolith**
This design system is a rejection of the "web-as-usual" container-based architecture. Instead of boxes, we build with light and void. It translates the raw, utilitarian essence of a terminal into a high-end editorial experience. By constraining ourselves to a pure black (#000000) canvas and a zero-radius (0px) geometry, we create an environment where content is not just displayed—it is archived.

The "monolith" approach relies on intentional asymmetry and extreme whitespace. We break the template look by treating the 800px centered layout not as a constraint, but as a column of high-density information surrounded by an infinite void.

## 2. Colors

The palette is strictly grayscale, utilizing tonal depth to replace traditional UI scaffolding.

- **Background & Surface:** The core experience lives on `background` (#000000). This is non-negotiable. 
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate content, designers must use vertical rhythm (spacing) or a shift to `surface-container-low` (#1b1b1b). 
- **Surface Hierarchy:** Use `surface-container` tiers to create "focal islands." A code snippet or a project detail should sit on `surface-container-highest` (#353535) to physically lift it toward the user without using a shadow.
- **The "Glass" Exception:** For floating navigation or overlays, use `surface` at 70% opacity with a heavy `backdrop-blur` (20px+). This creates a "frosted obsidian" effect that feels premium and intentional.
- **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#ffffff) to `secondary` (#c7c6c6). This prevents the white from feeling "flat" and adds a metallic, machined quality to the interaction.

## 3. Typography

We use **Inter** as a variable powerhouse. The hierarchy mimics a terminal's logic but uses editorial scales for impact.

- **Display (Large/Medium):** Set with `-0.04em` letter spacing and `95%` line height. These should feel heavy and architectural.
- **Headline & Title:** These are your anchors. Use `headline-lg` for project titles to create a clear "start" point for the eye.
- **Body:** `body-md` (0.875rem) is the workhorse. Increase line-height to `1.6` to ensure that even dense technical documentation feels breathable.
- **Labels (The Terminal Element):** `label-sm` should be used for metadata (dates, tags). To lean into the terminal aesthetic, use uppercase with `+0.1em` letter spacing. This provides a "utility" feel that contrasts against the fluid editorial headlines.

## 4. Elevation & Depth

In a world without shadows or borders, depth is an exercise in tonal layering.

- **The Layering Principle:** Construct the UI by stacking. Place `surface-container-lowest` elements on the `background` to create "recessed" areas. Place `primary` text on `surface-container-high` to create "active" areas.
- **Ambient Shadows:** Standard drop shadows are forbidden. If a component must "float" (like a modal), use a diffused glow of `on-surface` (#e2e2e2) at 4% opacity with a 64px blur. It should feel like a soft light source behind the element, not a shadow cast on a floor.
- **The "Ghost Border" Fallback:** If a boundary is required for accessibility in input fields, use `outline-variant` (#474747) at 20% opacity. It should be barely perceptible—a "suggestion" of a boundary.
- **Glassmorphism:** Use semi-transparent layers for persistent headers. As the user scrolls, the content blurring beneath the header provides a sense of physical depth and sophisticated materiality.

## 5. Components

### Buttons
- **Primary:** Background `primary` (#ffffff), Text `on-primary` (#1a1c1c). 0px radius. 
- **Secondary:** Background `transparent`, Ghost Border (20% opacity `outline`), Text `primary`.
- **Interaction:** On hover, primary buttons should invert or shift to `secondary_fixed_dim`. Transitions must be "instant" (50ms) to mimic terminal responsiveness.

### Chips (Tags)
- Forbid rounded pills. Use `surface-container-high` rectangular blocks. 
- Layout: `[ Text ]` – the brackets can be used in the label itself to reinforce the terminal-inspired origin.

### Lists & Project Rows
- **No Dividers:** Use `48px` of vertical whitespace between list items instead of lines. 
- **Leading Elements:** Use `primary` color for terminal prompts (e.g., `>`) to guide the eye to the list item's start.

### Input Fields
- Underline-only style. Use `outline-variant` for the underline. On focus, the underline expands to 2px and becomes `primary`. 
- No background fill unless it is `surface-container-lowest`.

### The "Status" Component
- A specific component for this system: A small, pulsing `primary` dot next to a `label-sm` indicating "System Live" or "Available for Hire." This adds a layer of "living" data to the minimalist frame.

## 6. Do's and Don'ts

### Do
- **Embrace the Edge:** Keep all corners at 0px. The system's strength lies in its sharp, architectural precision.
- **Use "Type as Graphic":** Let large-scale typography act as the primary visual interest.
- **Respect the 800px:** Use the margins outside the 800px for nothing but the pure black void.

### Don't
- **Don't use 100% White text for long body copy:** Use `on-surface-variant` (#c6c6c6) for long-form reading to prevent eye strain against the pure black background. Save #ffffff for headlines and CTAs.
- **Don't add shadows:** Shadows imply a light source that doesn't exist in a terminal environment. Stick to tonal shifts.
- **Don't use icons unless necessary:** Prefer text-based triggers (e.g., `[info]` instead of an `(i)` icon) to maintain the signature terminal aesthetic.