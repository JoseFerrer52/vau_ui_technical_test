import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../layout/components";
import HttpHandler from "../../../../helpers/httpHandler";
import "../style/editProfile.css";
import userImage from "../assets/usuario.png";

export const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const localNameUser = localStorage.getItem("nameUser") || ""; // Proveer valor por defecto
  const localEmail = localStorage.getItem("email") || ""; // Proveer valor por defecto

  const [formData, setFormData] = useState({
    userName: localNameUser,
    email: localEmail,
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

    const endpoint = "http://localhost:3000/api/user/update-user";
    const options = {
      method: "PUT" as const,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        userId,
        userName,
        email,
        password,
      },
    };

    try {
      const response = await HttpHandler.post(endpoint, options);
      setLoading(false);

      if (response.error) {
        console.error(response);
      } else {
        navigate("/home");
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

  return (
    <>
      <Header></Header>
      <div className="container">
        <section className="container">
          <form className="form-container" action="">
            <div className="img-center">
              <img src={userImage} alt="user" className="userImage" />
            </div>
            <h3>Edita tu perfil</h3>
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
                placeholder="Contraseña*"
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
              <button type="submit" onClick={handleSubmit} disabled={loading}>
                Enviar
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};
