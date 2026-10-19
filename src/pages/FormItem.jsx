import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";

export default function FormItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nomeAluno, setNomeAluno] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    local: "",
    data_encontrado: "",
  });

  useEffect(() => {
    const carregarFormulario = async () => {
      try {
        const [usuarioResposta, categoriasResposta, locaisResposta] =
          await Promise.all([
            api.get("/eu"),
            api.get("/categorias"),
            api.get("/locais"),
          ]);

        setNomeAluno(usuarioResposta.data.nome);
        setCategorias(categoriasResposta.data);
        setLocais(locaisResposta.data);

        if (id) {
          const itemResposta = await api.get(`/itens/${id}`);
          const item = itemResposta.data;

          setForm({
            nome: item.nome,
            descricao: item.descricao,
            categoria: item.categoria,
            local: item.local,
            data_encontrado: item.data_encontrado,
          });
        }
      } catch (error) {
        setErro(error.response?.data?.detail || "Erro ao carregar formulário.");
      }
    };

    carregarFormulario();
  }, [id]);

  const alterarCampo = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const salvar = async (event) => {
    event.preventDefault();
    setErro("");

    try {
      if (id) {
        await api.put(`/itens/${id}`, form);
        navigate(`/item/${id}`);
      } else {
        await api.post("/itens", form);
        navigate("/");
      }
    } catch (error) {
      setErro(error.response?.data?.detail || "Dados inválidos.");
    }
  };

  return (
    <>
      <Header nome={nomeAluno} />

      <main>
        <h1>{id ? "Editar item" : "Novo item"}</h1>

        <form onSubmit={salvar}>
          <label>
            Nome
            <input
              name="nome"
              value={form.nome}
              onChange={alterarCampo}
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={alterarCampo}
              required
            />
          </label>

          <label>
            Categoria
            <select
              name="categoria"
              value={form.categoria}
              onChange={alterarCampo}
              required
            >
              <option value="">Selecione</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </label>

          <label>
            Local
            <select
              name="local"
              value={form.local}
              onChange={alterarCampo}
              required
            >
              <option value="">Selecione</option>
              {locais.map((local) => (
                <option key={local} value={local}>
                  {local}
                </option>
              ))}
            </select>
          </label>

          <label>
            Data em que foi encontrado
            <input
              type="date"
              name="data_encontrado"
              value={form.data_encontrado}
              onChange={alterarCampo}
              required
            />
          </label>

          {erro && <p className="error">{erro}</p>}

          <div className="actions">
            <button type="submit">Salvar</button>
            <button
              type="button"
              className="secondary"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
