import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import signUpFormStyles from "../../style/signUpForm.module.css";
import HttpHandler from "../../../../helpers/httpHandler";
import { HeaderLogin } from "../../../layout/components";

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

    const endpoint =
      "https://vau-backend-technical-test.onrender.com/api/login/signUp";
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
      <HeaderLogin />
      <section className={signUpFormStyles.container}>
        <form
          className={signUpFormStyles.formContainer}
          onSubmit={handleSubmit}
        >
          <h3>Registrate y crea una nueva cuenta</h3>
          <div className={signUpFormStyles.boxInput}>
            <label htmlFor="userName">Nombre*</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              name="userName"
              id="userName"
              value={userName}
              onChange={handleOnChange}
              className={errors.userName && signUpFormStyles.errorInput}
            />
            {errors.userName && (
              <p className={signUpFormStyles.errorTexts}>{errors.userName}</p>
            )}
          </div>
          <div className={signUpFormStyles.boxInput}>
            <label htmlFor="email">Correo electrónico*</label>
            <input
              type="email"
              placeholder="Ingresa tu correo"
              name="email"
              id="email"
              value={email}
              onChange={handleOnChange}
              className={errors.email && signUpFormStyles.errorInput}
            />
            {errors.email && (
              <p className={signUpFormStyles.errorTexts}>{errors.email}</p>
            )}
          </div>
          <div className={signUpFormStyles.boxInput}>
            <label htmlFor="password">Contraseña*</label>
            <input
              type="password"
              placeholder="Ingresa una contraseña"
              name="password"
              id="password"
              value={password}
              onChange={handleOnChange}
              className={errors.password && signUpFormStyles.errorInput}
            />
            {errors.password && (
              <p className={signUpFormStyles.errorTexts}>{errors.password}</p>
            )}
          </div>
          <div className={signUpFormStyles.boxInput}>
            <label htmlFor="passwordConfirm">
              Ingresa nuevamente tu contraseña*
            </label>
            <input
              type="password"
              placeholder="Ingresa nuevamente tu contraseña*"
              name="passwordConfirm"
              value={passwordConfirm}
              onChange={handleOnChange}
              className={errors.passwordConfirm && signUpFormStyles.errorInput}
            />
            {errors.passwordConfirm && (
              <p className={signUpFormStyles.errorTexts}>
                {errors.passwordConfirm}
              </p>
            )}
          </div>
          <div className={signUpFormStyles.buttonAlign}>
            <button type="submit" disabled={loading}>
              Registrarse
            </button>
            <span className={signUpFormStyles.subtext}>
              Los campos marcados con (*) son obligatorios
            </span>
          </div>
        </form>
      </section>
    </>
  );
};
