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
            <section className="bg-soft-gray bg-dot-pattern/50 pt-6 pb-12 section-divider-top section-divider-bottom">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Browse Our Collection</h2>
                        <div className="h-1 w-20 bg-[#284E3D] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    {/* Shop All Button */}
                    <div className="flex justify-center mt-12">
                        <Link
                            href="/shop"
                            className="inline-flex items-center space-x-2 bg-[#284E3D] text-white font-bold px-10 py-4 rounded-full hover:bg-[#1e3a2d] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            <span>Explore Full Catalog</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <FeaturedReviews />

            {/* FAQ Section */}
            <FAQSection />
        </div>
    );
}
