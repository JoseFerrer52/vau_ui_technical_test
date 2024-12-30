import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/signInForm.css";
import { HeaderLogin } from "../../../layout/components";
import HttpHandler from "../../../../helpers/httpHandler";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,20}$/;

export const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberData: true,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const { email, password, rememberData } = formData;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.currentTarget;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });

    let errorMessage = "";
    if (name === "email" && !emailPattern.test(value)) {
      errorMessage = "El correo electrónico no es válido.";
    } else if (name === "password" && !passwordPattern.test(value)) {
      errorMessage =
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = { ...errors };
    if (!emailPattern.test(email)) {
      validationErrors.email = "El correo electrónico no es válido.";
    }
    if (!passwordPattern.test(password)) {
      validationErrors.password =
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

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
        alert("Error al iniciar sesión");
        console.error(response);
      } else {
        const { userId, token, email, userName } =
          response.data.object.dataUser[0];

        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("nameUser", userName);

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
        <form className="wrapper-container" onSubmit={handleSubmit}>
          <h1>Iniciar Sesión</h1>
          <div className="input-box">
            <input
              placeholder="Correo electronico"
              type="text"
              name="email"
              value={email}
              onChange={handleOnChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="input-box">
            <input
              placeholder="Contraseña"
              type="password"
              name="password"
              value={password}
              onChange={handleOnChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
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
          <button type="submit" disabled={loading}>
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
