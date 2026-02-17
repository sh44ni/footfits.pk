'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Footprints } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/lib/context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

const conditionColors: Record<string, string> = {
    'Brand New': 'bg-green-500',
    'Excellent': 'bg-blue-500',
    'Very Good': 'bg-yellow-500',
    'Good': 'bg-orange-500',
};

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);

    // ... (inside component)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.sizes && product.sizes.length > 0) {
            addItem(product, product.sizes[0], 1);
            toast.success('Added to Cart', {
                description: `${product.name} (${product.sizes[0]}) added.`
            });
        }
    };

    const conditionColor = conditionColors[product.condition_label.split(' ')[0]] || 'bg-gray-500';

    return (
        <Link href={`/product/${product.slug}`}>
            <div className="group w-full bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
                            onClick={(e) => {
                                e.preventDefault();
                                setIsWishlisted(!isWishlisted);
                            }}
                            className="ml-auto bg-white/90 p-1.5 rounded-full hover:bg-white transition-colors"
                        >
                            <Heart
                                className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
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
                        className="w-full mt-3 py-2 border-2 border-primary text-primary text-xs font-bold rounded hover:bg-primary hover:text-white transition-colors uppercase tracking-wide"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
}
