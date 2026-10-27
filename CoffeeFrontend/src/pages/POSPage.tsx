import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { createOrder } from "../api/orders";
import { getErrorMessage } from "../utils/errors";
import { formatMoney } from "../utils/money";
import type { Product } from "../types";
import "../style/POSPage.css";

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err, "Ошибка загрузки товаров")));
  }, []);

  const addToCart = (product: Product) => {
    setError("");
    setSuccess("");

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prev,
        { productId: product.id, name: product.name, price: product.price, quantity: 1 },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setError("");
    setSuccess("");

    if (cart.length === 0) {
      setError("Корзина пустая");
      return;
    }

    setSubmitting(true);

    try {
      const order = await createOrder(
        cart.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      );

      setCart([]);
      setSuccess(`Заказ #${order.id} оформлен на ${formatMoney(order.total)}`);
    } catch (err) {
      setError(getErrorMessage(err, "Ошибка создания заказа"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pos-page-wrapper">
      <h1>Касса</h1>

      <div className="pos-page">
        <div className="pos-main">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h4 title={product.name}>{product.name}</h4>

              <p>{formatMoney(product.price)}</p>

              <button onClick={() => addToCart(product)}>Добавить</button>
            </div>
          ))}
        </div>

        <div className="pos-cart">
          <h2>Корзина</h2>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          {cart.length === 0 && <p>Корзина пустая</p>}

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <strong>{item.name}</strong>

                <div className="cart-qty">
                  <button onClick={() => updateQuantity(item.productId, -1)} aria-label="Меньше">
                    −
                  </button>
                  <span>
                    {item.quantity} × {formatMoney(item.price)}
                  </span>
                  <button onClick={() => updateQuantity(item.productId, 1)} aria-label="Больше">
                    +
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.productId)}>Удалить</button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <hr />
            <h3>Итого: {formatMoney(total)}</h3>
            <button onClick={handleCheckout} disabled={submitting || cart.length === 0}>
              {submitting ? "Оформление..." : "Оформить заказ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
