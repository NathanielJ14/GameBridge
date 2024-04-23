import Logout from "../LogoutBtn/Logout";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <h1 className="navbar-brand navHeader my-0">GameBridge</h1>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-link active" href="/dashboard">Dashboard</a>
                        <a className="nav-link" href="/account">Link Accounts</a>
                    </div>
                    <div className="">
                        <Logout />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
