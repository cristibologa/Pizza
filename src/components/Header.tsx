import Logo from "/pizza_logo.svg";
import style from "./Header.module.css";
import { Group, Button } from "@mantine/core";
import { ChevronDown, RotateCcwClock, User } from "lucide-react";

export default function Header() {
  return (
    <header className={`${style.header} container`}>
      <div className={style.wraper}>
        <a className={style.logo} href="#">
          <img src={Logo} alt="Logo" />
          Pizza
        </a>
        <Group>
          <Group>
            <Button
              variant="transparent"
              rightSection={
                <ChevronDown size={16} color="var(--accent-quaternary)" />
              }
              c="var(--primary)"
            >
              Укажите адрес доставки
            </Button>

            <Button
              size="compact-xl"
              radius="xl"
              color="var(--surface-foreground)"
            >
              <RotateCcwClock size={24} color="var(--primary)" />
            </Button>

            <Button
              size="compact-xl"
              radius="xl"
              color="var(--surface-foreground)"
            >
              <User size={24} color="var(--primary)" />
            </Button>
          </Group>
          <Button
            radius="xl"
            color="var(--orange-50)"
            c="var(--accent-quaternary)"
          >
            Войти
          </Button>
        </Group>
      </div>
    </header>
  );
}
