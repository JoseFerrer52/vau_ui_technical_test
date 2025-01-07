import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import signInFormStyles from "../style/signInForm.module.css";
import HttpHandler from "../../../../helpers/httpHandler";
import { FaLock, FaUser } from "react-icons/fa";
import { HeaderLogin } from "../../../layout/components";

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

    const endpoint =
      "https://vau-backend-technical-test.onrender.com/api/login/singIn";
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
      <HeaderLogin />

      <div className={signInFormStyles.wrapper}>
        <form
          className={signInFormStyles.wrapperContainer}
          onSubmit={handleSubmit}
        >
          <h1>Iniciar Sesión</h1>
          <div className={signInFormStyles.inputBox}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              placeholder="Ingresa tu correo electrónico"
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={handleOnChange}
              autoFocus
              className={errors.email && signInFormStyles.errorInput}
            />
            <FaUser className={signInFormStyles.icon} />
            {errors.email && (
              <p className={signInFormStyles.errorTexts}>{errors.email}</p>
            )}
          </div>
          <div className={signInFormStyles.inputBox}>
            <label htmlFor="password">Contraseña</label>
            <input
              placeholder="Ingresa tu contraseña"
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handleOnChange}
              className={errors.password && signInFormStyles.errorInput}
            />
            <FaLock className={signInFormStyles.icon} />
            {errors.password && (
              <p className={signInFormStyles.errorTexts}>{errors.password}</p>
            )}
          </div>
          <div className={signInFormStyles.rememberForgot}>
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
          <div className={signInFormStyles.registerLink}>
            <p>
              No tengo cuenta, <a href="/sign-up">registrarme</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};
