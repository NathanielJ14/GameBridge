import LoginForm from "../../Components/LoginRegForms/LoginForm";
import RegisterForm from "../../Components/LoginRegForms/RegisterForm";
import "../Home/home.css";

function Home() {

    return (
        <div className="home text-white">
            <h1 className="text-center my-5">Welcome To GameBridge</h1>
            <div className="d-flex container justify-content-around mt-5">
                <LoginForm />
                <RegisterForm />
            </div>
        </div>
    )
}

export default Home;
