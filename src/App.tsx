import Header from "./components/Header";
import NavList from "./components/NavList";
import { useFetch } from "@mantine/hooks";
import type { GetPizzaCatalogResponse } from "./generated/api/types.gen";
import Main from "./components/Main";
import { useActiveSection } from "./components/useActiveSection";
import { categoryKeys } from "./components/categories"; // <-- add this

function App() {
  const { data } = useFetch<GetPizzaCatalogResponse>(
    "https://juniorsbootcamp.ru/api/pizzas/catalog",
  );
  const active = useActiveSection(categoryKeys, !!data);

  return (
    <>
      <Header />
      <NavList active={active} />
      <Main data={data?.catalog} />
    </>
  );
}

export default App;
