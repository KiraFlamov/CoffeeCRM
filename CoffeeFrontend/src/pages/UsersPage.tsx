import { useEffect, useState } from "react";
import { getUsers, deleteUser, createUser } from "../api/users";
import { useAuth } from "../context/useAuth";
import { getErrorMessage } from "../utils/errors";
import type { Role, User } from "../types";
import "../style/UsersPage.css";

const roleLabels: Record<Role, string> = {
  admin: "Администратор",
  cashier: "Кассир",
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("cashier");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(getErrorMessage(err, "Ошибка загрузки пользователей")));
  }, []);

  const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Введите email");
      return;
    }

    if (password.length < 4) {
      setError("Пароль должен быть не короче 4 символов");
      return;
    }

    setBusy(true);

    try {
      const user = await createUser({ email, password, role });

      setUsers((prev) => [...(prev ?? []), user]);
      setEmail("");
      setPassword("");
      setRole("cashier");
    } catch (err) {
      setError(getErrorMessage(err, "Ошибка создания пользователя"));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Удалить пользователя ${user.email}?`)) return;

    setError("");
    setBusy(true);

    try {
      await deleteUser(user.id);
      setUsers((prev) => (prev ?? []).filter((item) => item.id !== user.id));
    } catch (err) {
      setError(getErrorMessage(err, "Ошибка удаления пользователя"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1>Пользователи</h1>

      {error && <div className="form-error">{error}</div>}

      <form className="users-form" onSubmit={handleCreate}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="cashier">{roleLabels.cashier}</option>
          <option value="admin">{roleLabels.admin}</option>
        </select>

        <button type="submit" disabled={busy}>
          Создать
        </button>
      </form>

      {!users ? (
        !error && <h2>Загрузка...</h2>
      ) : (
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
            {users.map((user) => {
              // Сервер не даёт удалять администраторов и самого себя
              const canDelete = user.role !== "admin" && user.id !== currentUser?.id;

              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{roleLabels[user.role]}</td>
                  <td>
                    {canDelete && (
                      <button
                        className="btn danger"
                        disabled={busy}
                        onClick={() => handleDelete(user)}
                      >
                        Удалить
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
