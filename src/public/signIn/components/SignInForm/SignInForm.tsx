import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../style/signInForm.css";
import { HeaderLogin } from "../../../layout/components";
import HttpHandler from "../../../../helpers/httpHandler";

export const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberData: true,
  });

  const { email, password, rememberData } = formData;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.currentTarget;
    console.log(name, value, checked);
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "http://localhost:3000/api/login/singIn";
    const options = {
      method: "POST" as const,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email,
        password,
        rememberData,
      },
    };

    try {
      const response = await HttpHandler.post(endpoint, options);
      setLoading(false);

      if (response.error) {
        console.error(response);
      } else {
        // Extrae userId y token de la respuesta
        const { userId, token, email, userName } =
          response.data.object.dataUser[0];

        // Guarda userId y token en localStorage
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("nameUser", userName);

        // Redirige a otra vista, por ejemplo: /dashboard
        navigate("/home");
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

      <div className="wrapper">
        <form className="wrapper-container" action="POST">
          <h1>Iniciar Sesión</h1>
          <div className="input-box">
            <input
              placeholder="Correo electronico"
              type="text"
              name="email"
              value={email}
              onChange={handleOnChange}
            />
            <FaUser />
          </div>
          <div className="input-box">
            <input
              placeholder="Contraseña"
              type="password"
              name="password"
              value={password}
              onChange={handleOnChange}
            />
            <FaLock />
          </div>
          <div className="remember-forgot">
            <label>
              <input
                type="Checkbox"
                checked={rememberData}
                onChange={handleOnChange}
                name="rememberData"
              />
              Recordar Datos
            </label>
            <label>
              <a href="#">Olvide mi Contraseña</a>
            </label>
          </div>
          <button
            type="submit"
            onClick={(event) => handleSubmit(event)}
            disabled={!loading ? false : true}
          >
            Iniciar Sesión
          </button>
          <div className="register-link">
            <p>
              No tengo cuenta, <a href="/sing-up">registrarme</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
