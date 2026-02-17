import { getSliders, getProducts } from '@/lib/db/queries';
import { Slider, Product } from '@/types';
import HeroSlider from '@/components/storefront/HeroSlider';
import BrandCircles from '@/components/storefront/BrandCircles';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import FAQSection from '@/components/storefront/FAQSection';
import FeaturedReviews from '@/components/storefront/FeaturedReviews';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const [sliders, products] = await Promise.all([
        getSliders(),
        getProducts({ limit: 12 }),
    ]);

    return (
        <div>
            {/* Hero Slider */}
            <HeroSlider sliders={sliders} />

            {/* Brand Circles */}
            <BrandCircles />

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Browse Our Collection</h2>
                    <Link href="/shop" className="text-[#284E3D] font-medium hover:underline hidden md:inline-block">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Shop All Button */}
                <div className="flex justify-center mt-12">
                    <Link
                        href="/shop"
                        className="inline-flex items-center space-x-2 bg-[#284E3D] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#1e3a2d] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span>Shop All Products</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Reviews Section */}
            <FeaturedReviews />

            {/* FAQ Section */}
            <FAQSection />
        </div>
    );
}
