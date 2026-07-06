import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
} from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from DB when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]); // Clear cart if logged out
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCartApi();
      // cartData.items contains the array of CartItems
      setCart(cartData.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size = null, color = null) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
    }

    try {
      const updatedCart = await addToCartApi(product.id, quantity, size, color);
      setCart(updatedCart.items || []);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity, size = null, color = null) => {
    if (!user) return;
    try {
      const updatedCart = await updateCartItemApi(productId, quantity, size, color);
      setCart(updatedCart.items || []);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeFromCart = async (productId, size = null, color = null) => {
    if (!user) return;
    try {
      const updatedCart = await removeCartItemApi(productId, size, color);
      setCart(updatedCart.items || []);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  // Tính tổng số lượng
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Tính tổng tiền
  const cartTotal = cart.reduce(
    (total, item) => total + item.quantity * (item.product?.price || 0),
    0,
  );

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, loading, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
