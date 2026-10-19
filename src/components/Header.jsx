import { Link } from "react-router-dom";

export default function Header({ nome }) {
  return (
    <header>
      <Link to="/" className="logo">
        Achados IFRN
      </Link>
      <span>Olá, {nome || "..."}</span>
    </header>
  );
}
