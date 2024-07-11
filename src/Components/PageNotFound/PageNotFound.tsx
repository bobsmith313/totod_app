import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <main>
            <p>Wrong URL <Link to="/">Go Home</Link>.</p>
        </main>
    )
}

export default PageNotFound