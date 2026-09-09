import Header from "./components/Header";
import NavList from "./components/NavList";
import { useFetch } from "@mantine/hooks";
function App() {
  const { data, loading, error } = useFetch(
    "https://juniorsbootcamp.ru/api/pizzas/catalog",
  );
  console.log(data);
  return (
    <>
      <Header />
      <NavList />
    </>
  );
}

export default App;
