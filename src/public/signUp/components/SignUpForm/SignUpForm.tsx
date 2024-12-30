import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/signUpForm.css";
import { HeaderLogin } from "../../../layout/components";
import HttpHandler from "../../../../helpers/httpHandler";

const userNamePattern = /^[a-zA-Z0-9_]{1,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,20}$/;

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const { userName, email, password, passwordConfirm } = formData;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });

    /*Validación en tiempo real*/
    let errorMessage = "";
    if (name === "userName") {
      if (value.length > 20) {
        errorMessage =
          "El nombre de usuario no puede tener más de 20 caracteres.";
      } else if (!userNamePattern.test(value)) {
        errorMessage =
          "El nombre de usuario solo puede contener letras, números y guiones bajos.";
      }
    } else if (name === "email" && !emailPattern.test(value)) {
      errorMessage = "El correo electrónico no es válido.";
    } else if (name === "password" && !passwordPattern.test(value)) {
      errorMessage =
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
    } else if (name === "passwordConfirm" && value !== formData.password) {
      errorMessage = "Las contraseñas no coinciden.";
    }
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /*Validación antes de enviar el formulario*/

    const validationErrors = { ...errors };
    if (userName.length > 20) {
      validationErrors.userName =
        "El nombre de usuario no puede tener más de 20 caracteres.";
    }
    if (!userNamePattern.test(userName)) {
      validationErrors.userName =
        "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    }
    if (!emailPattern.test(email)) {
      validationErrors.email = "El correo electrónico no es válido.";
    }
    if (!passwordPattern.test(password)) {
      validationErrors.password =
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }
    if (password !== passwordConfirm) {
      validationErrors.passwordConfirm = "Las contraseñas no coinciden.";
    }

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

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
        passwordConfirm,
      },
    };

    try {
      const response = await HttpHandler.post(endpoint, options);
      setLoading(false);

      if (response.error) {
        alert("Error al registrarse");
        console.error(response);
      } else {
        alert("Registro exitoso");
        console.log("Register successful", response.data);
        navigate("/sign-in");
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
          <form className="form-container" onSubmit={handleSubmit}>
            <h3>Registrate y crea una nueva cuenta</h3>
            <div className="box-input">
              <input
                type="text"
                placeholder="Nombre de usuario*"
                name="userName"
                value={userName}
                onChange={handleOnChange}
              />
              {errors.userName && <p className="error">{errors.userName}</p>}
            </div>
            <div className="box-input">
              <input
                type="email"
                placeholder="Correo electrónico*"
                name="email"
                value={email}
                onChange={handleOnChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="box-input">
              <input
                type="password"
                placeholder="Contraseña*"
                name="password"
                value={password}
                onChange={handleOnChange}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="box-input">
              <input
                type="password"
                placeholder="Ingresa nuevamente tu contraseña*"
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={handleOnChange}
              />
              {errors.passwordConfirm && (
                <p className="error">{errors.passwordConfirm}</p>
              )}
            </div>
            <div className="buttton-align">
              <button type="submit" disabled={loading}>
                Registrarse
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};
