import { Route, Routes } from "react-router-dom";
import Detalhe from "./pages/Detalhe";
import FormItem from "./pages/FormItem";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/item/:id" element={<Detalhe />} />
      <Route path="/novo" element={<FormItem />} />
      <Route path="/editar/:id" element={<FormItem />} />
    </Routes>
  );
}
