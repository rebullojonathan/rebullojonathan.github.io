<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Keep theme state in the reusable theme toggle, apply semantic CSS variables through root theme classes, and persist the display preference in browser storage after hydration to avoid SSR mismatches.
- Use IntersectionObserver for one-time section reveals and CSS for press feedback; honor reduced-motion preferences so interactions remain accessible.
- Keep tech-stack categories and CDN logo pointers in a shared browser-safe data module and render them through the reusable tools component; this keeps the categorized list and marquee consistent. Use equal duplicated flex sets and CSS-only transform animation, hide decorative copies from assistive technology and stop movement for reduced motion.
- Keep the reveal footer after the opaque main curtain in DOM order, use CSS scroll timelines for optional parallax, and fall back to a static footer for reduced motion or short viewports; theme the curtain through existing semantic surface tokens.
- Keep the work-gallery tool orbit in a reusable component with inline vector marks and CSS-only rotation/counter-rotation; use real accessible links and pause for hover, keyboard focus and reduced motion without new dependencies.
