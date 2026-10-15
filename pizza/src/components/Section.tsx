import { useEffect, type ReactNode } from "react";
import { useIntersection } from "@mantine/hooks";

import style from "./Main.module.css";

type SectionProps = {
  id: string;
  title: string;
  onVisibleChange: (id: string, visible: boolean) => void;
  children: ReactNode;
};

export default function Section({
  id,
  title,
  onVisibleChange,
  children,
}: SectionProps) {
  const { ref, entry } = useIntersection<HTMLElement>({
    // Trigger band between 20% and 40% from the top of the viewport
    rootMargin: "-20% 0px -60% 0px",
  });

  const isVisible = entry?.isIntersecting ?? false;

  useEffect(() => {
    onVisibleChange(id, isVisible);
  }, [id, isVisible, onVisibleChange]);

  return (
    <section ref={ref} id={id} className={style.section}>
      <h2>{title}</h2>
      <div className={style.sectionBody}>{children}</div>
    </section>
  );
}
