import '@/components/header/style/header.css';
import Link from "next/link";
const HeaderOfficial = () => {
    return (
        <header className="header">
            <div >Biuro rzeczy znalezionych</div>
            <nav>
                <ul>
                    <li>
                        <Link href={`/urzednik`}>Lista przedmiotów</Link>
                        <Link href={`/urzednik/dodaj`}>Dodoaj przedmiot</Link>
                        <Link href={`/import`}>Importuj z pliku</Link>
                        <Link href={`/archiwum`}>Archiwum</Link>
                    </li>
                </ul>
            </nav>
        </header>

    )
}
export default HeaderOfficial
