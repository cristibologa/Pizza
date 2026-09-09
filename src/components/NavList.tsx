import { Group, Button } from "@mantine/core";

import { ShoppingBasket } from "lucide-react";

import style from "./NavList.module.css";

export default function NavList() {
  return (
    <div className={`${style.nav__list} container`}>
      <Group>
        <Button
          radius="xl"
          c="var(--primary)"
          color="var(--surface-foreground)"
        >
          Пиццы
        </Button>

        <Button
          radius="xl"
          c="var(--primary)"
          color="var(--surface-foreground)"
        >
          Завтраки
        </Button>
        <Button
          radius="xl"
          c="var(--primary)"
          color="var(--surface-foreground)"
        >
          Крылышки
        </Button>
        <Button
          radius="xl"
          c="var(--primary)"
          color="var(--surface-foreground)"
        >
          Милкшейки
        </Button>
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
