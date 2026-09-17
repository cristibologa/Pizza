import style from "./Cart.module.css";
import { Button } from "@mantine/core";
import { Plus } from "lucide-react";
import type { PizzaProduct } from "../generated/api/types.gen";
interface CartProps {
  data: PizzaProduct | null;
}

export default function Cart({ data }: CartProps) {
  if (!data) {
    return "loading";
  }

  const img = data.img;
  return (
    <div className={style.cart}>
      <div className={style.image__wraper}>
        <img src={`https://juniorsbootcamp.ru/api/${img}`} alt="" />
      </div>
      <h4>{data?.name}</h4>
      <Button
        radius="xl"
        size="md"
        c="var(--primary)"
        color="var(--surface-foreground)"
        justify="space-between"
        rightSection={<Plus />}
      >
        от {data.sizes[0].price}
      </Button>
    </div>
  );
}
