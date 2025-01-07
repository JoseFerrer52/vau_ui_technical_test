import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../layout/components";
import HttpHandler from "../../../../helpers/httpHandler";
import { Modal } from "../../../modal/components";
import editProfile from "../style/editProfile.module.css";
import userImage from "../assets/usuario.png";

const userNamePattern = /^[a-zA-Z0-9_]{1,20}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,20}$/;
export const EditProfile = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const localNameUser = localStorage.getItem("nameUser") || "";
  const localEmail = localStorage.getItem("email") || "";

  const [formData, setFormData] = useState({
    userName: localNameUser,
    email: localEmail,
    password: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const { userName, email, password } = formData;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });

    let errorMessage = "";
    if (name === "userName" && value) {
      if (value.length > 20) {
        errorMessage =
          "El nombre de usuario no puede tener más de 20 caracteres.";
      } else if (!userNamePattern.test(value)) {
        errorMessage =
          "El nombre de usuario solo puede contener letras, números y guiones bajos.";
      }
    } else if (name === "email" && value && !emailPattern.test(value)) {
      errorMessage = "El correo electrónico no es válido.";
    } else if (name === "password" && value && !passwordPattern.test(value)) {
      errorMessage =
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }
    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = { ...errors };
    if (userName && userName.length > 20) {
      validationErrors.userName =
        "El nombre de usuario no puede tener más de 20 caracteres.";
    }
    if (userName && !userNamePattern.test(userName)) {
      validationErrors.userName =
        "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    }
    if (email && !emailPattern.test(email)) {
      validationErrors.email = "El correo electrónico no es válido.";
    }
    if (password && !passwordPattern.test(password)) {
      validationErrors.password =
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    const body: any = { userId }; // initialize with userId as it must be present
    if (userName) body.userName = userName;
    if (email) body.email = email;
    if (password) body.password = password;
    const endpoint =
      "https://vau-backend-technical-test.onrender.com/api/user/update-user";
    const options = {
      method: "PUT" as const,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body,
    };

    try {
      const response = await HttpHandler.put(endpoint, options);
      setLoading(false);

      if (response.error) {
        alert("Error al actualizar el usuario");
        console.error(response);
      } else {
        localStorage.setItem("nameUser", userName);
        localStorage.setItem("email", email);

        navigate("/home");
        alert("Usuario actualizado correctamente");
        console.log("Update successful", response.data);
      }
    } catch (error) {
      console.error("An unexpected error occurred", error);
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleSubmitToDeleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = { ...errors };
    if (password && !passwordPattern.test(password)) {
      validationErrors.password =
        "La contraseña debe tener entre 8 y 20 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const endpoint =
      "https://vau-backend-technical-test.onrender.com/api/user/delete-user";
    const options = {
      method: "POST" as const,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        userId,
        password,
      },
    };

    try {
      const response = await HttpHandler.post(endpoint, options);
      setLoading(false);

      if (response.error) {
        alert("Error al eliminar el usuario");
        console.error(response);
      } else {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("nameUser");
        navigate("/sign-in");
        alert("Usuario eliminado correctamente");
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
      <Header></Header>
      <div className={editProfile.container}>
        <section className={editProfile.container}>
          <form className={editProfile.formContainer} onSubmit={handleSubmit}>
            <div className={editProfile.imgcenter}>
              <img
                src={userImage}
                alt="user"
                className={editProfile.userImage}
              />
            </div>
            <h3>Edita tu perfil</h3>
            <div className={editProfile.boxInput}>
              <input
                type="text"
                placeholder="Nombre de usuario"
                name="userName"
                value={userName}
                onChange={handleOnChange}
                className={errors.userName && editProfile.errorInput}
              />
              {errors.userName && (
                <p className={editProfile.errorTexts}>{errors.userName}</p>
              )}
            </div>
            <div className={editProfile.boxInput}>
              <input
                type="email"
                placeholder="Correo electrónico"
                name="email"
                value={email}
                onChange={handleOnChange}
                className={errors.email && editProfile.errorInput}
              />
              {errors.email && (
                <p className={editProfile.errorTexts}>{errors.email}</p>
              )}
            </div>
            <div className={editProfile.boxInput}>
              <input
                type="password"
                placeholder="Contraseña*"
                name="password"
                value={password}
                onChange={handleOnChange}
                className={errors.password && editProfile.errorInput}
              />
              {errors.password && (
                <p className={editProfile.errorTexts}>{errors.password}</p>
              )}
            </div>
            <div className={editProfile.butttonAlign}>
              <button
                className={editProfile.buttonSend}
                type="submit"
                disabled={loading}
              >
                Enviar
              </button>
              <button
                className={editProfile.buttonRed}
                onClick={(event) => {
                  event.preventDefault();
                  setModalOpen(true);
                }}
              >
                Eliminar cuenta
              </button>
            </div>
          </form>
        </section>
      </div>
      <Modal isOpen={modalOpen}>
        <div>
          <section className={editProfile.container}>
            <form
              className={editProfile.formContainer}
              onSubmit={handleSubmitToDeleteUser}
            >
              <h3>Introduce tu contraseña para eliminar tu cuenta</h3>
              <div className={editProfile.boxInput}>
                <input
                  type="password"
                  placeholder="Contraseña*"
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  className={errors.email && editProfile.errorInput}
                />
                {errors.password && (
                  <p className={editProfile.errorTexts}>{errors.password}</p>
                )}
              </div>
              <div className={editProfile.butttonAlignModal}>
                <button
                  className={editProfile.buttonSendModal}
                  onClick={(event) => {
                    event.preventDefault();
                    setModalOpen(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  className={editProfile.buttonRedModal}
                  type="submit"
                  disabled={loading}
                >
                  Eliminar cuenta
                </button>
              </div>
            </form>
          </section>
        </div>
      </Modal>
    </>
  );
};
