import type { PizzaProduct } from "../generated/api/types.gen";
import Cart from "./Cart";
import Section from "./Section";
import { category } from "./categories";

import style from "./Main.module.css";

type MainProps = {
  data?: PizzaProduct[];
  onVisibleChange: (id: string, visible: boolean) => void;
};

export default function Main({ data, onVisibleChange }: MainProps) {
  if (!data) {
    return "loading";
  }

  return (
    <main className="container">
      <div className={style.main}>
        {Object.entries(category).map(([key, title]) => (
          <Section
            key={key}
            id={key}
            title={title}
            onVisibleChange={onVisibleChange}
          >
            {data
              .filter((item) => item.category === key)
              .map((item) => (
                <Cart key={item._id} data={item} />
              ))}
          </Section>
        ))}
      </div>
    </main>
  );
}
