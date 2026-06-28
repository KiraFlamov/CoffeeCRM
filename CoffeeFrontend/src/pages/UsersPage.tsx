import { useEffect, useState } from "react";
import { getUsers, deleteUser, createUser } from "../api/users";

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

  const handleCreate = async () => {

    if (!email.trim()) {
      alert("Введите email");
      return;
    }

    if (!password.trim()) {
      alert("Введите пароль");
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
    } catch (error) {
      console.error(error);
      alert("Ошибка создания пользователя");
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

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 10,
        }}
      >
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
          <option value="cashier">
            Cashier
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button onClick={handleCreate}>
          Создать
        </button>
      </div>

      <h1>Пользователи</h1>

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