import { useState, useEffect } from "react";
import HttpHandler from "../../../../helpers/httpHandler";
import { useNavigate } from "react-router-dom";
import "../style/main.css";
import { Header } from "../../../layout/components";
import userImage from "../assets/usuario.png";

interface User {
  userName: string;
  email: string;
}

export const Main = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          navigate("/sign-in");
          return;
        }

        const endpoint =
          "https://vau-backend-technical-test.onrender.com/api/main/get-all-users";
        const options = {
          method: "POST" as const,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: { userId },
        };

        const response = await HttpHandler.post(endpoint, options);
        console.log("Respuesta del servidor:", response.data.object.users);

        if (response.error) {
          alert("Error al cargar los usuarios");
          console.error(response);
        } else {
          setUsers(response.data.object.users);
        }
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Header></Header>
      <div className="user-cards">
        {users.map((user) => (
          <div key={user.email} className="card">
            <img src={userImage} alt="user" className="userImage" />
            <p>usuario: {user.userName}</p>
            <p>Correo: {user.email}</p>
          </div>
        ))}
      </div>
    </>
  );
};
