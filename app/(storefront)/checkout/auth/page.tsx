'use client';

import Link from 'next/link';
import { CheckCircle, Package, Star, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CheckoutAuthPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 font-lexend">
                        How would you like to check out?
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Join us for the full experience or continue as a guest.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sign Up / Login Card (Primary) */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#284E3D] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-[#284E3D] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            RECOMMENDED
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-50 rounded-full text-[#284E3D]">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                                <p className="text-sm text-green-600 font-medium">Unlock the full FootFits experience</p>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-[#284E3D] mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-900 text-sm">Real-time Order Tracking</span>
                                    <p className="text-xs text-gray-500">Know exactly where your shoes are every step of the way.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#284E3D] mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-900 text-sm">Faster Future Checkouts</span>
                                    <p className="text-xs text-gray-500">Save your details securely for one-click ordering next time.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Star className="w-5 h-5 text-[#284E3D] mt-0.5 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-900 text-sm">Review & Rate Products</span>
                                    <p className="text-xs text-gray-500">Share your experience and help others choose the best fits.</p>
                                </div>
                            </li>
                        </ul>

                        <div className="space-y-3">
                            <Link
                                href="/signup?redirect=/checkout"
                                className="block w-full bg-[#284E3D] text-white text-center font-bold py-4 rounded-xl hover:bg-[#1e3a2d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Sign Up & Continue
                            </Link>
                            <div className="text-center text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link href="/login?redirect=/checkout" className="text-[#284E3D] font-semibold hover:underline">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Guest Checkout Card (Secondary) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                                    <ArrowRight className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Guest Checkout</h2>
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                You can checkout without creating an account. You'll still receive email updates about your order, but you won't be able to track it in real-time on our site or leave reviews.
                            </p>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full bg-white text-gray-700 text-center font-bold py-3 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
                        >
                            Continue as Guest
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
