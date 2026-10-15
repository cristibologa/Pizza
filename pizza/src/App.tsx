import { useCallback, useState } from "react";
import { useFetch } from "@mantine/hooks";

import Header from "./components/Header";
import NavList from "./components/NavList";
import Main from "./components/Main";
import { categoryKeys } from "./components/categories";
import type { GetPizzaCatalogResponse } from "./generated/api/types.gen";

function App() {
  const { data } = useFetch<GetPizzaCatalogResponse>(
    "http://localhost:3001/api/pizzas/catalog",
  );

  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const handleVisibleChange = useCallback((id: string, isVisible: boolean) => {
    setVisible((prev) =>
      prev[id] === isVisible ? prev : { ...prev, [id]: isVisible },
    );
  }, []);

  // First section (in page order) inside the trigger band; first one by default
  const active = categoryKeys.find((key) => visible[key]) ?? categoryKeys[0];

  return (
    <>
      <Header />
      <NavList active={active} />
      <Main data={data?.catalog} onVisibleChange={handleVisibleChange} />
    </>
  );
}

export default App;
