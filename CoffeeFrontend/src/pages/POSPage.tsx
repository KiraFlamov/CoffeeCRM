import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { createOrder } from "../api/orders";

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

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Корзина пустая");
      return;
    }

    try {
      await createOrder(
        cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );

      alert("Заказ создан");

      setCart([]);
    } catch (error) {
      console.error(error);
      alert("Ошибка создания заказа");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2>Товары</h2>

        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{product.name}</h4>

            <p>{product.price} ₽</p>

            <button
              onClick={() => addToCart(product)}
            >
              Добавить
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "350px",
          borderLeft: "1px solid #ddd",
          paddingLeft: "20px",
        }}
      >
        <h2>Корзина</h2>

        {cart.length === 0 && (
          <p>Корзина пустая</p>
        )}

        {cart.map((item) => (
          <div
            key={item.productId}
            style={{
              marginBottom: "12px",
            }}
          >
            <strong>{item.name}</strong>

            <p>
              {item.quantity} × {item.price} ₽
            </p>

            <button
              onClick={() =>
                removeFromCart(item.productId)
              }
            >
              Удалить
            </button>
          </div>
        ))}

        <hr />

        <h3>Итого: {total} ₽</h3>

        <button onClick={handleCheckout}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
}