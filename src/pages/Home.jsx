import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function Home() {
  const [nome, setNome] = useState("");
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.get("/eu")
      .then((resposta) => setNome(resposta.data.nome))
      .catch(() => {});

    api.get("/categorias")
      .then((resposta) => setCategorias(resposta.data))
      .catch(() => {});

    api.get("/locais")
      .then((resposta) => setLocais(resposta.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setCarregando(true);
      setErro("");

      try {
        const params = {};

        if (busca) params.busca = busca;
        if (status) params.status = status;
        if (categoria) params.categoria = categoria;
        if (local) params.local = local;

        const resposta = await api.get("/itens", { params });
        setItens(resposta.data);
      } catch (error) {
        setErro(
          error.response?.data?.detail ||
            "Não foi possível carregar. Verifique sua chave."
        );
      } finally {
        setCarregando(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [busca, status, categoria, local]);

  return (
    <>
      <Header nome={nome} />

      <main>
        <div className="title">
          <h1>Itens encontrados</h1>
          <Link className="button" to="/novo">
            + Novo item
          </Link>
        </div>

        <input
          placeholder="Buscar por nome ou descrição..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />

        <div className="filters">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="aguardando">Aguardando</option>
            <option value="devolvido">Devolvido</option>
          </select>

          <select
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={local}
            onChange={(event) => setLocal(event.target.value)}
          >
            <option value="">Todos os locais</option>
            {locais.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {carregando ? (
          <p>Carregando itens...</p>
        ) : erro ? (
          <p className="error">{erro}</p>
        ) : itens.length === 0 ? (
          <p>Nenhum item encontrado.</p>
        ) : (
          <div className="grid">
            {itens.map((item) => (
              <Link className="card" to={`/item/${item.id}`} key={item.id}>
                <span className={`badge ${item.status}`}>{item.status}</span>
                <h2>{item.nome}</h2>
                <p>{item.descricao}</p>
                <small>
                  {item.categoria} • {item.local}
                </small>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
