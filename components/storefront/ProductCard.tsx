'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Footprints, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/lib/context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
    index?: number;
}

const conditionColors: Record<string, string> = {
    'Brand New': 'bg-green-500',
    'Excellent': 'bg-blue-500',
    'Very Good': 'bg-yellow-500',
    'Good': 'bg-orange-500',
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const [heartPop, setHeartPop] = useState(false);

    const isSoldOut = product.stock <= 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isSoldOut) return;
        if (product.sizes && product.sizes.length > 0) {
            addItem(product, product.sizes[0], 1);
            setJustAdded(true);
            toast.success('Added to Cart', {
                description: `${product.name} (${product.sizes[0]}) added.`
            });
            setTimeout(() => setJustAdded(false), 1500);

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
        }
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
        setHeartPop(true);
        setTimeout(() => setHeartPop(false), 300);
    };

    const conditionColor = conditionColors[product.condition_label.split(' ')[0]] || 'bg-gray-500';

    // Stagger class based on index (wraps at 8)
    const staggerClass = `stagger-${(index % 8) + 1}`;

    return (
        <Link href={`/product/${product.slug}`}>
            <div className={`group w-full bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up ${staggerClass}`}>
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Footprints className="w-16 h-16 text-gray-300" />
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                        {product.is_new && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                NEW
                            </span>
                        )}
                        {product.original_price && Number(product.original_price) > Number(product.price) && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded ml-2">
                                {calculateDiscount(Number(product.original_price), Number(product.price))}% OFF
                            </span>
                        )}
                        <button
                            onClick={handleWishlist}
                            className="ml-auto bg-white/90 p-1.5 rounded-full hover:bg-white transition-all active:scale-90"
                        >
                            <Heart
                                className={`w-4 h-4 transition-all ${heartPop ? 'animate-pop' : ''} ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                        </button>
                    </div>

                    {/* Condition Badge */}
                    <div className="absolute bottom-2 left-2">
                        <span className={`${conditionColor} text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center space-x-1`}>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <span>{product.condition_label}</span>
                        </span>
                    </div>

                    {/* Sold Out Overlay */}
                    {isSoldOut && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white text-gray-900 text-sm font-bold px-4 py-1.5 rounded-full tracking-wide uppercase">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 space-y-1.5">
                    <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wide">
                        {product.brand} • {product.gender}
                    </p>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            {product.original_price && Number(product.original_price) > Number(product.price) ? (
                                <div className="flex items-center space-x-2">
                                    <p className="text-base font-bold text-foreground">
                                        {formatPrice(product.price)}
                                    </p>
                                    <p className="text-xs text-gray-400 line-through">
                                        {formatPrice(product.original_price)}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-base font-bold text-foreground">
                                    {formatPrice(product.price)}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                        className={`w-full mt-3 py-2 border-2 text-xs font-bold rounded uppercase tracking-wide btn-press flex items-center justify-center gap-1.5 transition-all duration-200 ${isSoldOut
                            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                            : justAdded
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-primary text-primary hover:bg-primary hover:text-white'
                            }`}
                    >
                        {isSoldOut ? (
                            'Sold Out'
                        ) : justAdded ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                Added!
                            </>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}
