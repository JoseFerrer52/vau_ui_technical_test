import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/signUpForm.css";
import { HeaderLogin } from "../../../layout/components";
import HttpHandler from "../../../../helpers/httpHandler";

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    paswordConfirm: "",
  });

  const { userName, email, password, paswordConfirm } = formData;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    console.log(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "http://localhost:3000/api/login/signUp";
    const options = {
      method: "POST" as const,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userName,
        email,
        password,
        paswordConfirm,
      },
    };

    try {
      const response = await HttpHandler.post(endpoint, options);
      setLoading(false);

      if (response.error) {
        console.error(response);
      } else {
        navigate("/sign-in");
        console.log("Login successful", response.data);
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <>
      <HeaderLogin></HeaderLogin>
      <div className="container">
        <section className="container">
          <form className="form-container" action="">
            <h3>Registrate y crea una nueva cuenta</h3>
            <div className="box-input">
              <input
                type="text"
                placeholder="Nombre de usuario*"
                name="userName"
                value={userName}
                onChange={handleOnChange}
              />
            </div>
            <div className="box-input">
              <input
                type="email"
                placeholder="Correo electrónico*"
                name="email"
                value={email}
                onChange={handleOnChange}
              />
            </div>
            <div className="box-input">
              <input
                type="password"
                placeholder="Contraseña*
"
                name="password"
                value={password}
                onChange={handleOnChange}
              />
            </div>
            <div className="box-input">
              <input
                type="password"
                placeholder="Ingresa nuevamente tu contraseña*"
                name="paswordConfirm"
                value={paswordConfirm}
                onChange={handleOnChange}
              />
            </div>
            <div className="buttton-align">
              <button
                type="submit"
                onClick={(event) => handleSubmit(event)}
                disabled={!loading ? false : true}
              >
                Registrarse
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};
