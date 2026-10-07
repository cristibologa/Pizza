import type { PizzaProduct } from "../generated/api/types.gen";
import Cart from "./Cart";
import { category } from "./categories";

import style from "./Main.module.css";

type MainProps = {
  data?: PizzaProduct[];
};

export default function Main({ data }: MainProps) {
  if (!data) {
    return "loading";
  }

  return (
    <main className="container">
      <div className={style.main}>
        {Object.entries(category).map(([key, title]) => {
          const items = data.filter((item) => item.category === key);

          return (
            <section key={key} id={key} className={style.section}>
              <h2>{title}</h2>
              <div className={style.sectionBody}>
                {items.map((item) => (
                  <Cart key={item._id} data={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
