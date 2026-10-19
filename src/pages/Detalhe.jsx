import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function Detalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [nome, setNome] = useState("");
  const [recebeu, setRecebeu] = useState("");
  const [erro, setErro] = useState("");

  const carregar = async () => {
    try {
      const [usuarioResposta, itemResposta] = await Promise.all([
        api.get("/eu"),
        api.get(`/itens/${id}`),
      ]);

      setNome(usuarioResposta.data.nome);
      setItem(itemResposta.data);
    } catch (error) {
      setErro(error.response?.data?.detail || "Erro ao carregar item.");
    }
  };

  useEffect(() => {
    carregar();
  }, [id]);

  const excluir = async () => {
    const confirmou = confirm("Tem certeza que deseja excluir?");

    if (!confirmou) {
      return;
    }

    try {
      await api.delete(`/itens/${id}`);
      navigate("/");
    } catch (error) {
      setErro(error.response?.data?.detail || "Erro ao excluir.");
    }
  };

  const devolver = async () => {
    if (!recebeu.trim()) {
      setErro("Informe quem recebeu o item.");
      return;
    }

    try {
      await api.patch(`/itens/${id}/devolver`, {
        devolvido_para: recebeu,
      });

      setRecebeu("");
      carregar();
    } catch (error) {
      setErro(error.response?.data?.detail || "Erro ao devolver.");
    }
  };

  return (
    <>
      <Header nome={nome} />

      <main>
        <Link to="/">← Voltar</Link>

        {erro && <p className="error">{erro}</p>}

        {!item ? (
          <p>Carregando...</p>
        ) : (
          <section className="detail">
            <span className={`badge ${item.status}`}>{item.status}</span>

            <h1>{item.nome}</h1>

            <p>
              <b>Descrição:</b> {item.descricao}
            </p>
            <p>
              <b>Categoria:</b> {item.categoria}
            </p>
            <p>
              <b>Local:</b> {item.local}
            </p>
            <p>
              <b>Encontrado em:</b> {item.data_encontrado}
            </p>

            {item.devolvido_para && (
              <p>
                <b>Devolvido para:</b> {item.devolvido_para}
              </p>
            )}

            <div className="actions">
              <Link className="button" to={`/editar/${id}`}>
                Editar
              </Link>
              <button className="danger" onClick={excluir}>
                Excluir
              </button>
            </div>

            {item.status === "aguardando" && (
              <div className="return">
                <h3>Marcar como devolvido</h3>
                <input
                  placeholder="Nome de quem recebeu"
                  value={recebeu}
                  onChange={(event) => setRecebeu(event.target.value)}
                />
                <button onClick={devolver}>Confirmar</button>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
