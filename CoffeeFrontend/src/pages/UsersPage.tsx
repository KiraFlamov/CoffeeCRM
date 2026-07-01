import { useEffect, useState } from "react";
import { getUsers, deleteUser, createUser } from "../api/users";
import "../style/UsersPage.css";

type User = {
  id: number;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setError("");

    if (!email.trim()) {
      setError("Введите email");
      return;
    }

    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }

    if (password.length < 4) {
      setError("Пароль должен быть минимум 4 символа");
      return;
    }

    try {
      const user = await createUser({
        email,
        password,
        role,
      });

      setUsers((prev) => [...prev, user]);

      setEmail("");
      setPassword("");
      setRole("cashier");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Ошибка создания пользователя");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Удалить пользователя?");

    if (!confirmed) return;

    try {
      await deleteUser(id);

      setUsers((prev) =>
        prev.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Ошибка удаления");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>

      {error && <div className="form-error">{error}</div>}

      <h1>Пользователи</h1>

      <div className="users-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleCreate}>Создать</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}