'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { addItem } = useCart();
    const router = useRouter();
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);

    const isSoldOut = product.stock <= 0;

    const handleAddToCart = () => {
        if (isSoldOut) return;
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            setError('Please select a size');
            return;
        }

        const sizeToAdd = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');

        setAddingToCart(true);
        addItem(product, sizeToAdd, 1);
        setError('');

        toast.success('Added to Cart', {
            description: `${product.name} (${sizeToAdd}) has been added to your cart.`
        });

        // Track analytics
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'add_to_cart',
                path: window.location.pathname,
                product_id: product.id,
            }),
        }).catch(console.error);

        setTimeout(() => setAddingToCart(false), 600);
    };

    const handleBuyNow = () => {
        if (isSoldOut) return;
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            setError('Please select a size');
            return;
        }

        const sizeToAdd = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
        setBuyingNow(true);
        addItem(product, sizeToAdd, 1);

        // Track analytics
        fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'add_to_cart',
                path: window.location.pathname,
                product_id: product.id,
            }),
        }).catch(console.error);

        router.push('/cart');
    };

    return (
        <div className="space-y-6">
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-foreground">Select Size</p>
                        {error && <p className="text-xs text-red-500 font-medium animate-fade-in-up">{error}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => { setSelectedSize(size); setError(''); }}
                                disabled={isSoldOut}
                                className={`px-4 py-2 border rounded transition-all font-medium text-sm btn-press ${isSoldOut
                                    ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                                    : selectedSize === size
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
                {isSoldOut ? (
                    <div className="w-full bg-gray-100 border-2 border-gray-200 text-gray-500 font-bold py-3.5 rounded-lg text-center uppercase tracking-wide cursor-not-allowed">
                        Sold Out
                    </div>
                ) : (
                    <>
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-full bg-[#284E3D] text-white font-bold py-3.5 rounded-lg hover:bg-[#284E3D]/90 transition-all btn-press shadow-sm uppercase tracking-wide disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {addingToCart ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add to Cart'
                            )}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={buyingNow}
                            className="w-full border-2 border-[#284E3D] text-[#284E3D] font-bold py-3.5 rounded-lg hover:bg-[#284E3D] hover:text-white transition-all btn-press shadow-sm uppercase tracking-wide disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {buyingNow ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Redirecting...
                                </>
                            ) : (
                                'Buy Now'
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
