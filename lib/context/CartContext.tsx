'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface CartItem {
    product: Product;
    size: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, size: string, quantity?: number) => void;
    removeItem: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('footfits_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('footfits_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (product: Product, size: string, quantity: number = 1) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find(
                (item) => item.product.id === product.id && item.size === size
            );

            if (existingItem) {
                return prevItems.map((item) =>
                    item.product.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { product, size, quantity }];
        });
    };

    const removeItem = (productId: string, size: string) => {
        setItems((prevItems) =>
            prevItems.filter(
                (item) => !(item.product.id === productId && item.size === size)
            )
        );
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId, size);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getItemCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getSubtotal = () => {
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getItemCount,
                getSubtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
