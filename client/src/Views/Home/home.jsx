import CoolHeader from "../../Components/Header/CoolHeader";
import LoginForm from "../../Components/LoginRegForms/LoginForm";
import RegisterForm from "../../Components/LoginRegForms/RegisterForm";
import "../Home/home.css";

const Home = () => {
    return (
        <div className="home text-white">
            <div className="text-center mt-4">
                <CoolHeader />
            </div>
            <div className="d-flex container justify-content-around formBox">
                <LoginForm />
                <div className="middleLine"></div>
                <RegisterForm />
            </div>
        </div>
    )
}

export default Home;
