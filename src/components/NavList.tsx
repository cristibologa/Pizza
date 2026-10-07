import { Group, Button } from "@mantine/core";
import { ShoppingBasket } from "lucide-react";

import { category } from "./categories";
import style from "./NavList.module.css";

type NavListProps = { active: string };

export default function NavList({ active }: NavListProps) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className={`${style.nav__list} container`}>
      <Group>
        {Object.entries(category).map(([key, title]) => (
          <Button
            key={key}
            radius="xl"
            variant={active === key ? "filled" : "light"}
            c={active === key ? "white" : "var(--primary)"}
            color={active === key ? "black" : "var(--surface-foreground)"}
            onClick={() => scrollTo(key)}
          >
            {title}
          </Button>
        ))}
      </Group>

      <Button
        color="var(--accent-quaternary)"
        leftSection={<ShoppingBasket size={16} color="var(--background)" />}
        radius="xl"
      >
        Корзина
      </Button>
    </div>
  );
}
