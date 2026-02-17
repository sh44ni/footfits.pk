import Link from 'next/link';
import { ShieldCheck, Truck, Heart, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'About Us | FootFits',
    description: 'Learn more about FootFits - your trusted source for authentic branded shoes in Pakistan.',
};

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Header Section */}
            <section className="pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">About Us</h1>
                    <div className="h-1 w-20 bg-[#284E3D] mx-auto rounded-full"></div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="pb-16 pt-4">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Welcome to <span className="font-bold text-[#284E3D]">FootFits</span>, Pakistan&apos;s premier destination for authentic branded footwear.
                        We believe that style usually shouldn&apos;t come with a hefty price tag. That&apos;s why we bring you a curated collection
                        of pre-loved and brand-new shoes from top global brands like Nike, Adidas, Puma, and more.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Our mission is simple: to provide high-quality, 100% original shoes at thrift prices.
                        Every pair is inspected for authenticity and quality, ensuring you get the best value for your money.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-[#F2F7F5] bg-grid-pattern py-16 section-divider-top section-divider-bottom">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Why Choose Us?</h2>
                        <div className="h-1 w-16 bg-[#284E3D] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Value 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 bg-green-50 text-[#284E3D] rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">100% Authentic, Always</h3>
                            <p className="text-gray-600">
                                Zero tolerance for fakes. We guarantee that every pair we sell is an original import from the USA or Europe.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 bg-green-50 text-[#284E3D] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Thrift Prices, Premium Quality</h3>
                            <p className="text-gray-600">
                                Get your favorite big-name brands at a fraction of the retail price without compromising on style or comfort.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="w-14 h-14 bg-green-50 text-[#284E3D] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Truck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Nationwide Cash on Delivery</h3>
                            <p className="text-gray-600">
                                Shop with confidence. We deliver to your doorstep anywhere in Pakistan with our reliable courier partners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to find your perfect pair?</h2>
                    <Link
                        href="/shop"
                        className="inline-flex items-center space-x-2 bg-[#284E3D] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1e3a2d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <span>Shop Now</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
