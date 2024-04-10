import "./LoginReg.css"

function LoginForm() {

    return (
        <div className="form">
            <div className="card bg-dark">
                <h2 className="text-center mt-2">Register</h2>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="username" required placeholder="Username" />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" id="email" required placeholder="Email" />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="password" required placeholder="Password" />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="confirmPassword" required placeholder="Confirm Password" />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn mt-2">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
