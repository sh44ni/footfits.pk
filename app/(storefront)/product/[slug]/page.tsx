import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

import { getProductBySlug, getProducts } from '@/lib/db/queries';
import { Product } from '@/types';
import Image from 'next/image';
import { Footprints, ShoppingCart, MessageCircle } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductCard from '@/components/storefront/ProductCard';
import ProductActions from '@/components/storefront/ProductActions';
import ProductImageGallery from '@/components/storefront/ProductImageGallery';
import TrustBadges from '@/components/storefront/TrustBadges';

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const similarProducts = await getProducts({ brand: product.brand, limit: 4 });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Left Column: Images */}
                <div>
                    <ProductImageGallery
                        images={Array.isArray(product.images) ? (product.images as string[]) : [product.images as string || '/placeholder.png']}
                        productName={product.name}
                    />
                </div>

                {/* Right Column: Product Info */}
                <div className="space-y-4">
                    <p className="text-xs uppercase text-secondary font-semibold tracking-wide">
                        {product.brand} • {product.gender}'s Shoes
                    </p>
                    <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

                    <div className="flex items-center space-x-2">
                        <span className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                            {product.condition_label}
                        </span>
                        {product.is_new && (
                            <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                Brand New
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        {product.original_price && Number(product.original_price) > Number(product.price) ? (
                            <>
                                <p className="text-3xl font-bold text-foreground">
                                    {formatPrice(product.price)}
                                </p>
                                <p className="text-xl text-gray-400 line-through">
                                    {formatPrice(product.original_price)}
                                </p>
                                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                                    {calculateDiscount(product.original_price, product.price)}% OFF
                                </span>
                            </>
                        ) : (
                            <p className="text-3xl font-bold text-foreground">
                                {formatPrice(product.price)}
                            </p>
                        )}
                    </div>

                    {/* Product Actions (Size & Buttons) */}
                    <ProductActions product={product} />

                    {/* Description */}
                    <div className="pt-6 border-t">
                        <h3 className="font-semibold text-foreground mb-2">Description</h3>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    {/* Condition Details */}
                    <div className="pt-4">
                        <h3 className="font-semibold text-foreground mb-2">Condition Details</h3>
                        <p className="text-gray-600">{product.condition_notes}</p>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <TrustBadges />

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Similar Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {similarProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
