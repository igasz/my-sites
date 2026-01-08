import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface CartProduct extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartProduct[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.email}`);
      if (savedCart) {
        setCartProducts(JSON.parse(savedCart));
      } else {
        setCartProducts([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cartProducts));
    }
  }, [cartProducts, user]);

  const addToCart = (product: Product, quantityToAdd: number) => {
    setCartProducts((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartProducts((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartProducts((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };
  const clearCart = () => {
    setCartProducts([]);
  };

  const cartCount = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartProducts, addToCart, removeFromCart, updateQuantity, cartCount, totalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart musi być używane wewnątrz CartProvider");
  }
  return context;
}