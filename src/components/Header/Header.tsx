import "@/components/Header/style/header.css";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import WcagBtns from "../WcagBtns/WcagBtns";

const Header = () => {
  return (
    <header className="header">
      {/* <Link className="header-text" href="/">Biuro rzeczy znalezionych</Link> */}
      <WcagBtns />
      <nav>
        <ul>
          <li>
            <Link className="btn btn-lg btn-secondary" href="/urzednik">
              Panel urzędnika
              <PersonIcon fontSize="small" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
