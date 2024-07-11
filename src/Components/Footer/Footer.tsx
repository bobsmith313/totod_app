import "./Footer.css"

const Footer = () => {
    const currentYear: number = new Date().getFullYear();

    return (
        <footer>
            <p>Copyright &copy; {currentYear}</p>
        </footer>
    )
}

export default Footer