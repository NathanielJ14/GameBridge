import Logout from "../LogoutBtn/Logout";
import "./Navbar.css";
import { useParams, Link } from 'react-router-dom';

const Navbar = () => {
    const { id } = useParams();

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <h1 className="navbar-brand navHeader my-0">GameBridge</h1>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <Link to={`/dashboard/${id}`} className="nav-link">Dashboard</Link>
                        <Link to={`/account/${id}`} className="nav-link">Link Accounts</Link>
                    </div>
                    <div>
                        <Logout />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
