import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], ready: boolean) {
  // First section is active by default
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (!ready) return; // sections don't exist in the DOM until data is loaded

    const visible = new Set<string>();

    const pick = () => {
      // Page scrolled to the very bottom -> last section is active
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }
      // Otherwise the first section (in page order) inside the trigger band
      const current = ids.find((id) => visible.has(id));
      if (current) setActive(current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pick();
      },
      // Trigger band between 20% and 40% from the top of the viewport
      { rootMargin: "-20% 0px -60% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", pick, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", pick);
    };
  }, [ids, ready]);

  return active;
}
