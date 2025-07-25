
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Service } from '../types.ts';
import { useNotification } from './NotificationContext.tsx';

interface CartContextType {
  cartItems: Service[];
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Service[]>([]);
  const { addNotification } = useNotification();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('homeglam_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      localStorage.removeItem('homeglam_cart');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('homeglam_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (service: Service) => {
    setCartItems(prevItems => {
      const isItemInCart = prevItems.find(item => item.id === service.id);
      if (isItemInCart) {
        addNotification(`${service.name} is already in your cart.`, 'info');
        return prevItems;
      }
      addNotification(`${service.name} added to cart!`, 'success');
      return [...prevItems, service];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== serviceId));
    addNotification('Item removed from cart.', 'error');
  };
  
  const clearCart = () => {
    setCartItems([]);
  }

  const cartCount = cartItems.length;
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
