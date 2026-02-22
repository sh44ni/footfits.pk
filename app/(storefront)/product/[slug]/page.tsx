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

                    {/* Condition + Brand New badges */}
                    <div className="flex items-center flex-wrap gap-2">
                        {/* Condition Badge — color scales with score */}
                        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${product.condition_score >= 9
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : product.condition_score >= 7
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" /></svg>
                            {product.condition_label}
                        </span>

                        {/* Brand New Badge */}
                        {product.is_new && (
                            <span className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                                ✦ Brand New
                            </span>
                        )}
                    </div>

                    {/* Price row */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {product.original_price && Number(product.original_price) > Number(product.price) ? (
                            <>
                                <p className="text-3xl font-bold text-foreground">
                                    {formatPrice(product.price)}
                                </p>
                                <p className="text-xl text-gray-400 line-through">
                                    {formatPrice(product.original_price)}
                                </p>
                                {/* % OFF Tag */}
                                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                    ⚡ {calculateDiscount(product.original_price, product.price)}% OFF
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

                    {/* Stock Urgency Indicator */}
                    {product.stock !== undefined && product.stock <= 9 && (
                        <div className="pt-4">
                            {product.stock === 0 ? (
                                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                    <span className="text-lg">😔</span>
                                    <div>
                                        <p className="text-sm font-bold text-red-700">Sold Out</p>
                                        <p className="text-xs text-red-500">This pair is no longer available</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 relative overflow-hidden">
                                        {/* Pulse ring */}
                                        <span className="relative flex h-3 w-3 shrink-0">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-amber-800 leading-tight">
                                                Only {product.stock} {product.stock === 1 ? 'pair' : 'pairs'} left 🔥
                                            </p>
                                            <p className="text-xs text-amber-600 mt-0.5">
                                                {product.stock <= 3 ? 'Almost gone — grab it before someone else does!' : 'Selling fast — secure yours now'}
                                            </p>
                                        </div>
                                        <span className="text-2xl select-none">👟</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5 px-1">
                                        💡 Most of our products are individually hand-picked, single pieces — once gone, they&apos;re gone.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
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
