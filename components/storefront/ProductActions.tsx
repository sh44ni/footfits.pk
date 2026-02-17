'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { addItem } = useCart();
    const router = useRouter();
    const [error, setError] = useState('');

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            setError('Please select a size');
            return;
        }

        // If product has no sizes, use default "Total" or handle logic
        const sizeToAdd = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');

        addItem(product, sizeToAdd, 1);
        setError('');
        // Optional: Show toast or feedback
        alert('Added to cart!');
    };

    const handleBuyNow = () => {
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            setError('Please select a size');
            return;
        }

        const sizeToAdd = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
        addItem(product, sizeToAdd, 1);
        router.push('/cart');
    };

    return (
        <div className="space-y-6">
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-foreground">Select Size</p>
                        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => { setSelectedSize(size); setError(''); }}
                                className={`px-4 py-2 border rounded transition-all font-medium text-sm ${selectedSize === size
                                    ? 'border-[#284E3D] bg-[#284E3D] text-white shadow-md'
                                    : 'border-gray-200 hover:border-[#284E3D] hover:text-[#284E3D] bg-white text-gray-900'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#284E3D] text-white font-bold py-3.5 rounded-lg hover:bg-[#284E3D]/90 transition-all active:scale-[0.98] shadow-sm uppercase tracking-wide"
                >
                    Add to Cart
                </button>
                <button
                    onClick={handleBuyNow}
                    className="w-full border-2 border-[#284E3D] text-[#284E3D] font-bold py-3.5 rounded-lg hover:bg-[#284E3D] hover:text-white transition-all active:scale-[0.98] shadow-sm uppercase tracking-wide"
                >
                    Buy Now
                </button>

            </div>
        </div>
    );
}
