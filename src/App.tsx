import Header from "./components/Header";
import NavList from "./components/NavList";
import { useFetch } from "@mantine/hooks";
import type { GetPizzaCatalogResponse } from "./generated/api/types.gen";
import Main from "./components/Main";

function App() {
  const { data, loading, error } = useFetch<GetPizzaCatalogResponse>(
    "https://juniorsbootcamp.ru/api/pizzas/catalog",
  );

  return (
    <>
      <Header />
      <NavList />
      <Main data={data?.catalog} />
    </>
  );
}

export default App;
