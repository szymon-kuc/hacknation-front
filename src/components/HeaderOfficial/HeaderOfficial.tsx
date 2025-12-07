import '@/components/Header/style/header.css';
import Link from "next/link";
const HeaderOfficial = () => {
    return (
        <header className="header">
            <Link className="header-text" href="/">Biuro rzeczy znalezionych</Link>
            <nav>
                <ul>
                    <li>
                        <Link href={`/urzednik`}>Lista przedmiotów</Link>

                    </li>
                    <li>
                        <Link href={`/urzednik/dodaj`}>Dodoaj przedmiot</Link>
                    </li>
                    <li>
                        <Link href={`/urzednik/import`}>Importuj z pliku</Link>
                    </li>
                    <li>
                        <Link href={`/archiwum`}>Archiwum</Link>
                    </li>
                </ul>
            </nav>
        </header>

    )
}
export default HeaderOfficial
