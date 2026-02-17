'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "Are the shoes original?",
        answer: "Yes, 100%. We have zero tolerance for fakes. All our shoes are imported authentic pairs from USA & Europe. We strictly do not sell replicas or first copies."
    },
    {
        question: "What is your return policy?",
        answer: "You can return any item within 3 days of delivery if it's unworn and you have an unboxing video. We offer full refunds for condition issues or if the product doesn't match the description."
    },
    {
        question: "Do you offer Cash on Delivery?",
        answer: "Yes, we offer Cash on Delivery (COD) nationwide across Pakistan. You pay when the rider delivers your parcel. Shipping is free for orders above Rs. 5,000."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-[#F2F7F5] bg-grid-pattern pt-8 pb-12 section-divider-top scroll-mt-20" id="faq-section">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Frequently Asked Questions</h2>
                    <div className="h-1 w-20 bg-[#284E3D] mx-auto rounded-full"></div>
                </div>

                <div className="space-y-4 mb-10">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 overflow-hidden ${openIndex === index ? 'shadow-md ring-1 ring-[#284E3D]/10' : ''}`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-[#284E3D] text-white' : 'bg-green-50 text-[#284E3D]'}`}>
                                        <HelpCircle className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">{faq.question}</h3>
                                </div>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'pb-6 max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="pl-12">
                                    <p className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/faq"
                        className="inline-flex items-center justify-center px-8 py-3 bg-[#284E3D] text-white font-semibold rounded-full hover:bg-[#1e3a2d] transition-all shadow hover:shadow-lg group"
                    >
                        Visit FAQ Page
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
