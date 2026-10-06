import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      if (item.itemType === "account") {
        const exists = prev.find(
          (i) => i.itemType === "account" && i.accountId === item.accountId,
        );
        if (exists) {
          return prev;
        }
        return [...prev, { ...item, quantity: 1 }];
      } else {
        const index = prev.findIndex(
          (i) =>
            i.itemType === "card" &&
            i.cardBrand === item.cardBrand &&
            i.denomination === item.denomination,
        );
        if (index > -1) {
          const updated = [...prev];
          updated[index].quantity += item.quantity || 1;
          return updated;
        }
        return [...prev, { ...item, quantity: item.quantity || 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const target = updated[index];
      if (target.itemType === "card") {
        const newQty = target.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((_, i) => i !== index);
        }
        target.quantity = newQty;
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    if (item.itemType === "account") {
      return sum + (item.price || 0);
    }
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);

  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalAmount,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
