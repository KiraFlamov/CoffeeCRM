import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { getErrorMessage } from "../utils/errors";
import { formatMoney, kopecksToRubles, rublesToKopecks } from "../utils/money";
import type { Product } from "../types";
import "../style/ProductsPage.css";

type EditState = { id: number; name: string; price: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState<EditState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadProducts = async () => {
    setProducts(await getProducts());
  };

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err, "Ошибка загрузки товаров")));
  }, []);

  // Общая обёртка: блокирует кнопки, показывает ошибку сервера
  const run = async (action: () => Promise<void>, fallback: string) => {
    setError("");
    setBusy(true);

    try {
      await action();
    } catch (err) {
      setError(getErrorMessage(err, fallback));
    } finally {
      setBusy(false);
    }
  };

  const validate = (productName: string, productPrice: string) => {
    if (!productName.trim()) {
      setError("Введите название товара");
      return null;
    }

    const kopecks = rublesToKopecks(productPrice);

    if (kopecks === null) {
      setError("Цена должна быть положительным числом");
      return null;
    }

    return { name: productName.trim(), price: kopecks };
  };

  const handleCreate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const data = validate(name, price);
    if (!data) return;

    await run(async () => {
      await createProduct(data);
      setName("");
      setPrice("");
      await loadProducts();
    }, "Ошибка создания товара");
  };

  const handleSave = async () => {
    if (!editing) return;
    setError("");

    const data = validate(editing.name, editing.price);
    if (!data) return;

    await run(async () => {
      await updateProduct(editing.id, data);
      setEditing(null);
      await loadProducts();
    }, "Ошибка сохранения товара");
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Снять с продажи «${product.name}»? История заказов сохранится.`)) {
      return;
    }

    await run(async () => {
      await deleteProduct(product.id);
      await loadProducts();
    }, "Ошибка удаления товара");
  };

  if (!products) {
    return error ? <div className="form-error">{error}</div> : <h2>Загрузка...</h2>;
  }

  return (
    <div className="products-page">
      <h1>Товары</h1>

      {error && <div className="form-error">{error}</div>}

      <form className="products-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Цена, ₽"
          min="0.01"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button type="submit" disabled={busy}>
          Добавить
        </button>
      </form>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="muted">
                Товаров пока нет
              </td>
            </tr>
          )}

          {products.map((product) =>
            editing?.id === product.id ? (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                  />
                </td>
                <td className="actions">
                  <div className="row-actions">
                    <button onClick={handleSave} disabled={busy}>
                      Сохранить
                    </button>
                    <button className="btn secondary" onClick={() => setEditing(null)}>
                      Отмена
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{formatMoney(product.price)}</td>
                <td className="actions">
                  <div className="row-actions">
                    <button
                      className="btn secondary"
                      disabled={busy}
                      onClick={() =>
                        setEditing({
                          id: product.id,
                          name: product.name,
                          price: kopecksToRubles(product.price),
                        })
                      }
                    >
                      Изменить
                    </button>
                    <button
                      className="btn danger"
                      disabled={busy}
                      onClick={() => handleDelete(product)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
