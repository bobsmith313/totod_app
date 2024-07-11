import { Link } from 'react-router-dom';
import "./Header.css";

const Header = () => {
    return (
        <header>
            <h1>ToDo App</h1>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header