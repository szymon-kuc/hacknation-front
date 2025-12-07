import "@/components/Header/style/header.css";
import Link from "next/link";
import WcagBtns from "../WcagBtns/WcagBtns";
const HeaderOfficial = () => {
  return (
    <header className="header">
      {/* <Link className="header-text" href="/">Biuro rzeczy znalezionych</Link> */}
      <WcagBtns />
      <nav>
        <ul>
          <li>
            <Link className="btn btn-md btn-secondary-link" href={`/urzednik/archiwum`}>
              Archiwum
            </Link>
          </li>
          <li>
            <Link className="btn btn-md btn-secondary-link" href={`/urzednik`}>
              Lista przedmiotów
            </Link>
          </li>
          <li>
            <Link className="btn btn-md btn-secondary-reverse" href={`/urzednik/import`}>
              Importuj z pliku
            </Link>
          </li>
          <li>
            <Link className="btn btn-md btn-secondary" href={`/urzednik/dodaj`}>
              Dodaj przedmiot
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default HeaderOfficial;
