import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | footfits.pk',
    description: 'Find answers to common questions about footfits.pk, our authentic branded shoes, shipping, returns, and more.',
};

export default function FAQPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#284E3D] mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-600">footfits.pk — Your Questions, Answered</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Operated by Projekts Vision (Private) Limited (SECP Reg No. 0318679)
                    </p>
                </div>

                <div className="space-y-12">
                    {/* About Section */}
                    <section className="bg-white rounded-2xl shadow-sm p-8 text-black">
                        <h2 className="text-2xl font-bold text-[#284E3D] mb-6 flex items-center">
                            <span className="bg-[#284E3D]/10 p-2 rounded-lg mr-3">🏢</span>
                            About footfits.pk
                        </h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">What is footfits.pk?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    footfits.pk is an online store for 100% original branded shoes in Pakistan. We sell pre-loved, store returns, and brand new authentic shoes imported directly from the USA and Europe. We carry brands like Nike, Adidas, New Balance, ASICS, HOKA, Puma, Converse, Vans, Reebok, Brooks, Skechers, and Under Armour. Every shoe is inspected, cleaned, and photographed before listing.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Is footfits.pk a registered company?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Yes. footfits.pk is a trade name operated by Projekts Vision (Private) Limited, incorporated under the Securities and Exchange Commission of Pakistan (SECP Registration No. 0318679) and registered with the Federal Board of Revenue (NTN: I196608). We are a legitimate, tax-paying business based in Karachi, Pakistan.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Where is footfits.pk located?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We are based in Karachi, Sindh, Pakistan. We currently operate online only and deliver nationwide across Pakistan.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">How is footfits.pk different from other thrift shoe stores?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We focus on honesty and transparency. Every shoe on our website has a clear condition grade, detailed notes, and 5 real photos. We do not use stock images. We offer Cash on Delivery and process refunds within 5 business days. We are a registered company with accountability.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Authenticity Section */}
                    <section className="bg-white rounded-2xl shadow-sm p-8 text-black">
                        <h2 className="text-2xl font-bold text-[#284E3D] mb-6 flex items-center">
                            <span className="bg-[#284E3D]/10 p-2 rounded-lg mr-3">✅</span>
                            Are The Shoes Original?
                        </h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Are the shoes original or first copy?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Every shoe on footfits.pk is 100% original and authentic. We have zero tolerance for replicas or first copies. Our shoes are imported from the USA and Europe from authorized retailers.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">How do I know they are not fake?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We inspect every shoe before listing—checking logos, stitching, serial numbers, and materials. Our photos show the actual shoe you will receive so you can verify it yourself. If you believe any shoe is not original, we offer a full refund with free return shipping.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">What does pre-loved mean?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Pre-loved means the shoe was previously owned. It doesn't mean damaged. Most are in excellent condition, some worn only once or twice. Each shoe has a condition score.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">What does store return mean?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Store returns are shoes purchased from retail stores in USA/Europe and returned by customers. They may be tried on but are often unworn or barely used.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Condition Section */}
                    <section className="bg-white rounded-2xl shadow-sm p-8 text-black">
                        <h2 className="text-2xl font-bold text-[#284E3D] mb-6 flex items-center">
                            <span className="bg-[#284E3D]/10 p-2 rounded-lg mr-3">👟</span>
                            Shoe Condition & Grades
                        </h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">What do the condition grades mean?</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li><strong className="text-[#284E3D]">Brand New (10/10):</strong> Unused with tags, never worn.</li>
                                    <li><strong className="text-[#284E3D]">Excellent (9-9.5/10):</strong> Worn 1-3 times, minimal signs of wear. Looks almost new.</li>
                                    <li><strong className="text-[#284E3D]">Very Good (7-8/10):</strong> Light visible wear. Fully functional, clean, great value.</li>
                                    <li><strong className="text-[#284E3D]">Good (5-6/10):</strong> Visible wear on sole/upper. Structurally solid, deep cleaned. Budget option.</li>
                                </ul>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Are the photos the actual shoe?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Yes. Every photo shows the exact shoe you will receive. We photograph each shoe from 5 angles (front, side, top, sole, heel). What you see is what you get.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Are shoes cleaned?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Yes. Every shoe is brushed, cleaned, and sanitized before listing and shipping.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Ordering & Shipping Section */}
                    <section className="bg-white rounded-2xl shadow-sm p-8 text-black">
                        <h2 className="text-2xl font-bold text-[#284E3D] mb-6 flex items-center">
                            <span className="bg-[#284E3D]/10 p-2 rounded-lg mr-3">📦</span>
                            Ordering & Shipping
                        </h2>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">How long does delivery take?</h3>
                                    <p className="text-gray-600">3-5 business days for major cities (Karachi, Lahore, Islamabad). 5-7 days for other cities.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">What is the delivery fee?</h3>
                                    <p className="text-gray-600">Free delivery on orders above Rs. 5,000. Flat Rs. 200 for orders below that.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Do you offer Cash on Delivery?</h3>
                                    <p className="text-gray-600">Yes, COD is available nationwide. You pay when the courier delivers.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">Can I track my order?</h3>
                                    <p className="text-gray-600">Yes. You'll receive a tracking number via SMS/WhatsApp. You can also track at <a href="/track" className="text-[#284E3D] underline">footfits.pk/track</a>.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Returns Section */}
                    <section className="bg-white rounded-2xl shadow-sm p-8 text-black">
                        <h2 className="text-2xl font-bold text-[#284E3D] mb-6 flex items-center">
                            <span className="bg-[#284E3D]/10 p-2 rounded-lg mr-3">↺</span>
                            Returns & Refunds
                        </h2>
                        <div className="space-y-6">
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">What is your return policy?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    You have 3 days from delivery to request a return. The shoe must be unworn and you MUST have an unboxing video.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Why do I need an unboxing video?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    It protects both you and us. It serves as proof of what was inside the package when you received it. Without it, returns cannot be processed.
                                </p>
                            </div>
                            <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">How long do refunds take?</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Processed within 5 business days after inspection. COD orders are refunded via JazzCash/Easypaisa.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3 bg-[#284E3D] text-white font-semibold rounded-full hover:bg-[#1e3a2d] transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
