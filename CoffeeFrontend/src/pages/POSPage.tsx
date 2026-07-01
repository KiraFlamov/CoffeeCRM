import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { createOrder } from "../api/orders";
import "../style/POSPage.css";

type Product = {
  id: number;
  name: string;
  price: number;
};

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setError("");

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + delta,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setError("");

    if (cart.length === 0) {
      setError("Корзина пустая");
      return;
    }

    try {
      await createOrder(
        cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      setCart([]);
    } catch (error) {
      console.error(error);
      setError("Ошибка создания заказа");
    }
  };

  return (
    <div className="pos-page-wrapper">
      <h1>Товары</h1>

      <div className="pos-page">
        <div className="pos-main">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h4>{product.name}</h4>

              <p>{product.price} ₽</p>

              <button onClick={() => addToCart(product)}>Добавить</button>
            </div>
          ))}
        </div>

        <div className="pos-cart">
          <h2>Корзина</h2>

          {error && <div className="form-error">{error}</div>}
          {cart.length === 0 && <p>Корзина пустая</p>}

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <strong>{item.name}</strong>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <button onClick={() => updateQuantity(item.productId, -1)}>−</button>
                  <span>{item.quantity} × {item.price} ₽</span>
                  <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
                </div>

                <button onClick={() => removeFromCart(item.productId)}>Удалить</button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <hr />
            <h3>Итого: {total} ₽</h3>
            <button onClick={handleCheckout}>Оформить заказ</button>
          </div>
        </div>
      </div>
    </div>
  );
}