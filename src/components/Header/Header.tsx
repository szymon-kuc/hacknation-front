import '@/components/Header/style/header.css';
import Link from "next/link";

const Header = () => {
    return (
        <header className="header">
            <Link className="header-text" href="/">Biuro rzeczy znalezionych</Link>
            <nav>
                <ul>
                    <li>
                        <Link href="/urzednik">Panel urzędnika</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
export default Header
