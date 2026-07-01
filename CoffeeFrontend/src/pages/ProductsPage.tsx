import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../api/products";
import "../style/ProductsPage.css";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async () => {
    setError("");

    if (!name.trim()) {
      setError("Введите название товара");
      return;
    }

    if (!price) {
      setError("Введите цену товара");
      return;
    }

    await createProduct({
      name,
      price: Number(price),
    });

    setName("");
    setPrice("");

    await fetchProducts();
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    await fetchProducts();
  };

  if (loading) return <h2>Загрузка...</h2>;

  return (
    <div className="products-page">
      <h1>Товары</h1>

      {error && <div className="form-error">{error}</div>}

      <div className="products-form">
        <input
          type="text"
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <button onClick={handleCreate}>Добавить</button>
      </div>

      <table border={1} cellPadding={10} className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price} ₽</td>
              <td>
                <button
                  onClick={() => handleDelete(p.id)}
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