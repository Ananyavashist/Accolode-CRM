const HIDE_AFTER_MS = 900;
const timers = new WeakMap<Element, number>();

function scrollTarget(event: Event): Element | null {
  const target = event.target;
  if (target === document || target === document.documentElement) {
    return document.documentElement;
  }
  return target instanceof Element ? target : null;
}

/** Reveal a scrollbar only while that surface is being scrolled. */
export function startRevealScrollbar() {
  const onScroll = (event: Event) => {
    const el = scrollTarget(event);
    if (!el) return;
    el.classList.add("is-scrolling");
    const prev = timers.get(el);
    if (prev) window.clearTimeout(prev);
    timers.set(
      el,
      window.setTimeout(() => {
        el.classList.remove("is-scrolling");
        timers.delete(el);
      }, HIDE_AFTER_MS),
    );
  };

  document.addEventListener("scroll", onScroll, { capture: true, passive: true });
}
